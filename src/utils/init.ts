import defaultFeatures from '../constant/defaultFeature'
import useAppStore from '../store/index'

export const initCmds = () => {
  const features = utools.db.allDocs('cmd-')
  if (features.length) return
  utools.db.bulkDocs(defaultFeatures)
  // 同时把数据初始化到pinia
  const appStore = useAppStore()
  appStore.init()
  for (let i = 0; i < defaultFeatures.length - 1; i++) {
    const {
      data: { code, explain, cmds, feature },
    } = defaultFeatures[i]
    if (feature) {
      utools.setFeature({
        code,
        explain,
        // @ts-ignore
        cmds,
        platform: ['win32', 'darwin', 'linux'],
      })
    }
  }
}

export const delAllCmds = async () => {
  for (let i = 0; i < defaultFeatures.length - 1; i++) {
    utools.db.remove(defaultFeatures[i]._id)
    utools.removeFeature(defaultFeatures[i].data.code)
  }
}
