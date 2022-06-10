import defaultFeatures from '../constant/defaultFeature'

export const initCmds = () => {
  const features = utools.db.allDocs('cmd-')
  if (features.length) {
    // 每次启动的时候都根据配置修改指令，这样尽可能减少版本更新带来的影响。
    // TODO 目前遇到的问题：
    // 1. 用户删除/取消快捷启动，更新版本依旧存在快捷唤醒词（但配置中是未启动），
    // 2. plugin.json 删除一个指令，不能直接快捷唤醒，即使用户配置的是快捷启动（通过下面这个方法可能会解决这个问题）。可能下下个版本起：不再默认提供指令快捷启动，需要用户自己配置
    features.forEach((item) => {
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
        utools.removeFeature(code)
      }
    })
    return
  }
  // 把默认数据同步到数据库
  utools.db.bulkDocs(defaultFeatures)
}
