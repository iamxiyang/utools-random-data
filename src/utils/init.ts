import defaultFeatures from '@/constant/defaultFeature'

export const initCmds = () => {
  const features = utools.getFeatures()
  if (features.length) return
  utools.db.bulkDocs(defaultFeatures)
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
