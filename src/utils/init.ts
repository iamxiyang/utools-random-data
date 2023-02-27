import defaultFeatures from '../constant/defaultFeature'

export const initCmds = () => {
  const features = utools.db.allDocs('cmd-')
  if (features.length) {
    // 每次启动的时候都根据配置修改指令，这样尽可能减少版本更新带来的影响。
    features.forEach((item) => {
      try {
        const {
          data: { code, explain, cmds, feature },
        } = item
        if (feature) {
          utools.setFeature({
            code,
            explain,
            cmds,
            platform: ['win32', 'darwin', 'linux'],
          })
        } else {
          utools.removeFeature(item._id)
        }
      } catch {}
    })
    return
  }
  // 把默认数据同步到数据库
  utools.db.bulkDocs(defaultFeatures)
}
