import defaultFeatures from '../constant/defaultFeature'

export const initCmds = () => {
  const features = utools.db.allDocs('cmd-')
  if (features.length) {
    return
  }
  // 把默认数据同步到数据库
  utools.db.bulkDocs(defaultFeatures)
}
