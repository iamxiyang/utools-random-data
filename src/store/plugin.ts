import { PiniaPluginContext } from 'pinia'
import isEqual from 'lodash.isequal'
import cloneDeep from 'lodash.clonedeep'
import defaultCommands from '../commands/default'
import defaultStringVariables from '../variables/string.default'

//  比较差异
const diff = (oldArr: DbDoc[], newArr: DbDoc[]) => {
  const oldIds = oldArr.map((row) => row._id)
  const newIds = newArr.map((row) => row._id)
  const addIds = newIds.filter((row) => !oldIds.includes(row))
  const delIds = oldIds.filter((row) => !newIds.includes(row))
  const add = newArr.filter((row) => addIds.includes(row._id))
  const del = oldArr.filter((row) => delIds.includes(row._id))

  const update = newArr.filter((row) => row._rev && !addIds.includes(row._id) && !delIds.includes(row._id) && !isEqual(row?.data, oldArr.find((item) => item._id === row._id)?.data))

  return {
    add,
    del,
    update,
  }
}

const syncDb = (state: { commands: DbCommands[]; variables: DbVariables[] }) => {
  const dbCommands = utools.db.allDocs('cmd-')
  const dbVariables = utools.db.allDocs('var-')

  const cmdDiff = diff(dbCommands, state.commands)
  const varDiff = diff(dbVariables, state.variables)

  // 指令新增、修改，需要判断是否修改 utools 的 feature
  ;[...cmdDiff.add, ...cmdDiff.update].forEach((row) => {
    if (row?.data?.feature) {
      const { code, explain, cmds } = cloneDeep(row.data)
      utools.setFeature({
        code,
        explain,
        cmds,
        platform: ['win32', 'darwin', 'linux'],
      })
    } else if (row?.data?.feature) {
      utools.removeFeature(row._id)
    }
  })

  // 指令被删除时，如果原本是 feature，需要删除 utools 的 feature
  cmdDiff.del.forEach((row) => {
    if (row?.data?.feature) {
      utools.removeFeature(row._id)
    }
  })

  // 批量新增和修改
  const allAddUpdate = [...cmdDiff.add, ...cmdDiff.update, ...varDiff.add, ...varDiff.update]
  if (allAddUpdate.length) {
    utools.db.bulkDocs(cloneDeep(allAddUpdate))
  }

  // 批量删除
  ;[...varDiff.del, ...cmdDiff.del].forEach((row) => {
    utools.db.remove(row._id)
  })
}

//  通过pinia的Api监听数据变更，进而实现数据直接操作，自动同步到utools
export const utoolsDbSync = ({ store }: PiniaPluginContext) => {
  if (store.$id !== 'app') return

  //  初始化数据
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

  store.$state.commands = allCmds
  store.$state.variables = allVars

  // 监听数据变化
  store.$subscribe(
    (_mutation) => {
      syncDb(store.$state as any)
    },
    {
      detached: true,
    },
  )
}
