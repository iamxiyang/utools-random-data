import { PiniaPluginContext } from 'pinia'
import isEqual from 'lodash.isequal'
import cloneDeep from 'lodash.clonedeep'
import defaultCommands from '../commands/default'
import defaultStringVariables from '../variables/string.default'

// 顺序存储的 key
const CMD_ORDER_KEY = 'commands-order-storage'

// 比较差异类型定义
interface DiffResult {
  add: DbDoc[]
  del: DbDoc[]
  update: DbDoc[]
}

/**
 * 比较本地状态和数据库状态的差异
 */
const diff = (oldArr: DbDoc[], newArr: DbDoc[]): DiffResult => {
  const oldMap = new Map(oldArr.map(item => [item._id, item]))
  const newMap = new Map(newArr.map(item => [item._id, item]))

  const add: DbDoc[] = []
  const del: DbDoc[] = []
  const update: DbDoc[] = []

  // 找出新增和修改
  for (const [id, newItem] of newMap) {
    const oldItem = oldMap.get(id)
    if (!oldItem) {
      add.push(newItem)
    } else if (!isEqual(newItem.data, oldItem.data)) {
      update.push(newItem)
    }
  }

  // 找出删除
  for (const [id, oldItem] of oldMap) {
    if (!newMap.has(id)) {
      del.push(oldItem)
    }
  }

  return { add, del, update }
}

/**
 * 保存指令顺序
 */
const saveCommandOrder = (commands: DbCommands[]) => {
  const orderIds = commands.map((cmd) => cmd._id)
  utools.dbStorage?.setItem(CMD_ORDER_KEY, orderIds)
}

/**
 * 根据保存的顺序对指令进行排序
 */
const sortCommandsByOrder = (commands: DbCommands[]): DbCommands[] => {
  const savedOrder = utools.dbStorage?.getItem(CMD_ORDER_KEY) as string[] | null
  if (!savedOrder || !savedOrder.length) return commands

  const orderMap = new Map<string, number>(savedOrder.map((id, index) => [id, index]))

  return [...commands].sort((a, b) => {
    const orderA = orderMap.get(a._id) ?? Infinity
    const orderB = orderMap.get(b._id) ?? Infinity
    return orderA - orderB
  })
}

/**
 * 设置或移除 uTools 功能关键字
 */
const syncUtoolsFeatures = (row: DbCommands, isDelete = false) => {
  // 优先使用数据中的 code，那是注册 Feature 的唯一凭证
  const code = row.data?.code || row._id

  if (!isDelete && row?.data?.feature) {
    const { explain, cmds } = row.data
    console.log('[DEBUG] 正在注册 uTools Feature, code:', code, 'cmds:', cmds)
    utools.setFeature({
      code,
      explain,
      cmds: cloneDeep(cmds),
      platform: ['win32', 'darwin', 'linux'],
    })
  } else {
    // 无论是显式删除指令，还是关闭了 feature 开关，都要移除
    console.log('[DEBUG] 正在移除 uTools Feature, code:', code)
    utools.removeFeature(code)
  }
}

/**
 * 同步数据到 uTools 数据库
 */
const syncDb = (state: { commands: DbCommands[]; variables: DbVariables[] }) => {
  try {
    const dbCommands = utools.db.allDocs('cmd-') as unknown as DbCommands[]
    const dbVariables = utools.db.allDocs('var-') as unknown as DbVariables[]

    const cmdDiff = diff(dbCommands, state.commands)
    const varDiff = diff(dbVariables, state.variables)

    // 同步 uTools Features
    cmdDiff.add.forEach(row => syncUtoolsFeatures(row as DbCommands))
    cmdDiff.update.forEach(row => syncUtoolsFeatures(row as DbCommands))
    cmdDiff.del.forEach(row => syncUtoolsFeatures(row as DbCommands, true))

    // 批量新增和修改
    const allAddUpdate = [...cmdDiff.add, ...cmdDiff.update, ...varDiff.add, ...varDiff.update]
    if (allAddUpdate.length) {
      console.log('[DEBUG] 正在批量写入数据库, 数量:', allAddUpdate.length)
      const results = utools.db.bulkDocs(cloneDeep(allAddUpdate))

      // 使用返回的 rev 更新状态，避免后续冲突
      results.forEach((res) => {
        if (res.ok) {
          const item = allAddUpdate.find(i => i._id === res.id)
          if (item) {
            item._rev = res.rev
            console.log('[DEBUG] 数据库写入成功, id:', res.id, 'new_rev:', res.rev)
          }
        } else {
          console.error('[DEBUG] 数据库写入失败, id:', res.id, 'error:', (res as any).message)
        }
      })
    }

    // 批量删除
    const allDel = [...cmdDiff.del, ...varDiff.del]
    allDel.forEach((row) => {
      utools.db.remove(row._id)
    })

    // 保存指令顺序
    saveCommandOrder(state.commands)
  } catch (error) {
    console.error('Failed to sync database:', error)
  }
}

/**
 * Pinia 插件：自动同步数据到 uTools
 */
export const utoolsDbSync = ({ store }: PiniaPluginContext) => {
  if (store.$id !== 'app') return

  // 初始化数据
  let allCmds = utools.db?.allDocs('cmd-') as DbCommands[]
  let allVars = utools.db?.allDocs('var-') as DbVariables[]

  // 首次运行，如果没有数据则加载默认数据
  if (!allCmds?.length) {
    allCmds = cloneDeep(defaultCommands)
    utools.db?.bulkDocs(allCmds)
    // 重新获取带 rev 的数据
    allCmds = utools.db?.allDocs('cmd-') as DbCommands[]
  }
  if (!allVars?.length) {
    allVars = cloneDeep(defaultStringVariables)
    utools.db?.bulkDocs(allVars)
    // 重新获取带 rev 的数据
    allVars = utools.db?.allDocs('var-') as DbVariables[]
  }

  // 确保所有数据都有 data 属性（兼容处理）
  allCmds = allCmds.filter(item => item && typeof item === 'object').map(item => {
    if (!item.data && (item as any).explain) {
      const { _id, _rev, ...data } = item as any
      return { _id, _rev, data: data as Commands }
    }
    return item
  })
  allVars = allVars.filter(item => item && typeof item === 'object').map(item => {
    if (!item.data && (item as any).name) {
      const { _id, _rev, ...data } = item as any
      return { _id, _rev, data: data as Variables }
    }
    return item
  })

  // 初始化 store 状态
  store.$state.commands = sortCommandsByOrder(allCmds)
  store.$state.variables = allVars

  // 监听 store 变化并同步
  store.$subscribe(
    () => {
      syncDb(store.$state as any)
    },
    { detached: true }
  )
}

