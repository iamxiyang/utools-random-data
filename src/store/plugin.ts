import { PiniaPluginContext } from 'pinia'
import { DebuggerEventExtraInfo, toRaw } from 'vue'

//  通过pinia的Api监听数据变更，进而实现数据直接操作，自动同步到utools
export const utoolsDbSync = ({ store }: PiniaPluginContext) => {
  if (!window.utools) return

  /* 
  utools操作

  获取已有功能列表 getFeatures
  新增功能 setFeature
  删除功能 removeFeature

  创建或更新数据库（用于记录指令列表） utools.db.put(doc) _id区分，修改要带_rev
  异步方式更新 utools.db.promises.put

  获取数据库中的所有文档 utools.db.allDocs
  获取单个文档 utools.db.get
  删除文档 utools.db.remove

  
  每次新增：db.put 如果 feature是true 同时调用 setFeature
  每次修改：db.put 如果 新feature是true 同时调用 removeFeature、setFeature
  每次删除：db.remove 如果 feature是true 同时调用 removeFeature

  */
  store.$subscribe((mutation) => {
    console.log(mutation.events)

    if (mutation.storeId !== 'app') return
    const { key, newValue, oldValue, target } = mutation.events as DebuggerEventExtraInfo
    if (key === 'length') {
      // TODO 这样无法判断具体是新增还是删除了哪个数据，需要考虑怎么记录
    } else if (key === 'feature') {
      // 修改快捷启动
      const { code, explain, cmds } = target as any
      if (newValue) {
        utools.setFeature({
          code,
          explain,
          cmds,
          platform: ['win32', 'darwin', 'linux'],
        })
      } else {
        utools.removeFeature(code)
      }
    } else {
    }
  })
}
