import { toRaw } from 'vue'
import { PiniaPluginContext } from 'pinia'
import isEqual from 'lodash.isequal'
import cloneDeep from 'lodash.cloneDeep'
import defaultFeature from '../constant/defaultFeature'

const tryRemoveFeature = (row: DbDoc) => {
  // 不知道具体原因，测试时发现内置指令删除时会报错，但尝试更新后再删除就不会报错，这里多尝试一次
  const { code, explain, cmds } = toRaw(row.data)
  const res = utools.removeFeature(row._id)
  if (!res) {
    utools.setFeature({
      code,
      explain,
      cmds,
    })
    utools.removeFeature(row._id)
  }
}

//  通过pinia的Api监听数据变更，进而实现数据直接操作，自动同步到utools
export const utoolsDbSync = ({ store }: PiniaPluginContext) => {
  // 直接获取一遍最新的，对比
  const getFeatures = (features: DbDoc[] = []) => {
    // db上的旧数据
    const data: DbDoc[] = window.utools ? utools.db.allDocs('cmd-') : cloneDeep(defaultFeature)

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
        tryRemoveFeature(row)
      }
      utools.db.remove(row._id)
    })
    update.forEach((row) => {
      if (!row.data.feature) {
        tryRemoveFeature(row)
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
        })
      }
    })
    utools.db.bulkDocs(addUpdate)
  }

  store.$subscribe(
    (mutation) => {
      if (mutation.storeId !== 'app') return
      getFeatures(toRaw(store.$state.features))
    },
    {
      detached: true,
    },
  )
}
