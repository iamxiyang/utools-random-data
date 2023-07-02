import { toRaw } from 'vue'
import { PiniaPluginContext } from 'pinia'
import isEqual from 'lodash.isequal'
import cloneDeep from 'lodash.clonedeep'
import defaultCommands from '../commands/default'
import defaultStringVariables from '../variables/string.default'

// TODO 计算 变量和指令的差异，判断是否需要新增、修改、删除
const getFeatures = (features: DbDoc[] = []) => {
  // db上的旧数据
  const data: DbDoc[] = window.utools ? utools.db.allDocs('cmd-') : cloneDeep([])

  const dataIds = data.map((row) => row._id)
  const featureIds = features.map((row) => row._id)

  // 计算新增
  const add: DbDoc[] = features.filter((row) => !dataIds.includes(row._id))
  // 计算删除
  const del: DbDoc[] = data.filter((row) => !featureIds.includes(row._id))
  // 计算其他差异
  const update: DbDoc[] = features.filter((row) => row._rev && !isEqual(row?.data, data.find((item) => item._id === row._id)?.data))

  update.forEach((row, index) => {
    update[index]._rev = data.find((item) => item._id === row._id)?._rev
  })

  if (!window.utools) return
  del.forEach((row) => {
    if (row.data.feature) {
      utools.removeFeature(row._id)
    }
    utools.db.remove(row._id)
  })
  update.forEach((row) => {
    if (!row.data.feature) {
      utools.removeFeature(row._id)
    }
  })
  const addUpdate = [...update, ...add]
  addUpdate.forEach((row) => {
    if (row.data.feature) {
      const { code, explain, cmds } = toRaw(row.data)
      utools.setFeature({
        code,
        explain,
        cmds,
        platform: ['win32', 'darwin', 'linux'],
      })
    }
  })
  utools.db.bulkDocs(addUpdate)
}

//  通过pinia的Api监听数据变更，进而实现数据直接操作，自动同步到utools
export const utoolsDbSync = ({ store }: PiniaPluginContext) => {
  //  初始化数据
  let allCmds = utools.db?.allDocs('cmd-')
  let allVars = utools.db?.allDocs('var-')

  if (!allCmds?.length) {
    allCmds = cloneDeep(defaultCommands)
    utools.db?.bulkDocs(allCmds)
  }
  if (!allVars?.length) {
    allVars = cloneDeep(defaultStringVariables)
    utools.db?.bulkDocs(allVars)
  }

  // 监听数据变化
  store.$subscribe(
    (mutation: any) => {
      console.log('🚀 ~ file: plugin.ts:71 ~ utoolsDbSync ~ mutation:', mutation)

      if (mutation.storeId !== 'app') return
      window?.utools && getFeatures(toRaw(store.$state.features))
    },
    {
      detached: true,
    },
  )
}
