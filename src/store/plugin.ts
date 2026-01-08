import { PiniaPluginContext } from 'pinia'
import isEqual from 'lodash.isequal'
import cloneDeep from 'lodash.clonedeep'
import defaultCommands from '../commands/default'
import defaultStringVariables from '../variables/string.default'

// 顺序存储的 key
const CMD_ORDER_KEY = 'commands-order-storage'

/**
 * 比较差异
 */
const diff = (oldArr: DbDoc[], newArr: DbDoc[]) => {
  const oldIds = oldArr.map((row) => row._id)
  const newIds = newArr.map((row) => row._id)
  const addIds = newIds.filter((row) => !oldIds.includes(row))
  const delIds = oldIds.filter((row) => !newIds.includes(row))
  const add = newArr.filter((row) => addIds.includes(row._id))
  const del = oldArr.filter((row) => delIds.includes(row._id))

  const update = newArr.filter(
    (row) =>
      row._rev &&
      !addIds.includes(row._id) &&
      !delIds.includes(row._id) &&
      !isEqual(row?.data, oldArr.find((item) => item._id === row._id)?.data)
  )

  return { add, del, update }
}

/**
 * 保存指令顺序
 */
const saveCommandOrder = (commands: DbCommands[]) => {
  const orderIds = commands.map((cmd) => cmd._id)
  const existing = utools.dbStorage?.getItem(CMD_ORDER_KEY)
  if (!isEqual(existing, orderIds)) {
    utools.dbStorage?.setItem(CMD_ORDER_KEY, orderIds)
  }
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
 * 同步数据到 uTools 数据库
 */
const syncDb = (state: { commands: DbCommands[]; variables: DbVariables[] }) => {
  const dbCommands = utools.db.allDocs('cmd-')
  const dbVariables = utools.db.allDocs('var-')

  const cmdDiff = diff(dbCommands, state.commands)
  const varDiff = diff(dbVariables, state.variables)

  // 指令新增、修改，需要判断是否修改 utools 的 feature
  cmdDiff.add.forEach((row) => {
    if (row?.data?.feature) {
      const { code, explain, cmds } = cloneDeep(row.data)
      utools.setFeature({
        code,
        explain,
        cmds,
        platform: ['win32', 'darwin', 'linux'],
      })
    }
  })

  cmdDiff.update.forEach((row) => {
    if (row?.data?.feature) {
      const { code, explain, cmds } = cloneDeep(row.data)
      utools.setFeature({
        code,
        explain,
        cmds,
        platform: ['win32', 'darwin', 'linux'],
      })
    } else {
      utools.removeFeature(row.data.code)
    }
  })

  // 指令被删除时，如果原本是 feature，需要删除 utools 的 feature
  cmdDiff.del.forEach((row) => {
    if (row?.data?.feature) {
      utools.removeFeature(row.data.code)
    }
  })

  // 批量新增和修改
  const allAddUpdate = [...cmdDiff.add, ...cmdDiff.update, ...varDiff.add, ...varDiff.update]
  if (allAddUpdate.length) {
    utools.db.bulkDocs(cloneDeep(allAddUpdate))
  }

  // 新添加的数据，store 缺少 rev 影响对比，需要重新获取
  ;[...cmdDiff.add, ...varDiff.add].forEach((row) => {
    row._rev = utools.db.get(row._id)?._rev
  })

    // 批量删除
    ;[...varDiff.del, ...cmdDiff.del].forEach((row) => {
      utools.db.remove(row._id)
    })

  // 保存指令顺序
  saveCommandOrder(state.commands)
}

/**
 * Pinia 插件：自动同步数据到 uTools
 */
export const utoolsDbSync = ({ store }: PiniaPluginContext) => {
  if (store.$id !== 'app') return

  // 清理废弃的存储 key
  const DEPRECATED_KEYS = ['plugin-db-initialized-v1']
  DEPRECATED_KEYS.forEach(key => {
    if (utools.dbStorage?.getItem(key) !== null) {
      utools.dbStorage?.removeItem(key)
    }
  })

  // 初始化数据
  let allCmds = utools.db?.allDocs('cmd-') as DbCommands[]
  let allVars = utools.db?.allDocs('var-') as DbVariables[]

  if (!allCmds?.length) {
    allCmds = cloneDeep(defaultCommands)
    utools.db?.bulkDocs(allCmds)
  }
  if (!allVars?.length) {
    allVars = cloneDeep(defaultStringVariables)
    utools.db?.bulkDocs(allVars)
  }

  // 初始化 store 状态
  store.$state.commands = sortCommandsByOrder(allCmds)
  store.$state.variables = allVars

  // 监听数据变化
  store.$subscribe(
    () => {
      syncDb(store.$state as any)
    },
    { detached: true }
  )
}
