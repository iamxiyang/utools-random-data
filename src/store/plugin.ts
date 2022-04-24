import { PiniaPluginContext } from 'pinia'
import { DebuggerEventExtraInfo } from 'vue'

//  通过pinia的Api监听数据变更，进而实现数据直接操作，自动同步到utools
export const utoolsDbSync = ({ store }: PiniaPluginContext) => {
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
  store.$subscribe(
    (mutation) => {
      console.log(mutation, store.$state.deleteId)

      if (mutation.storeId !== 'app') return
      const { type, key, newValue, oldValue, target } = mutation.events as DebuggerEventExtraInfo & { target: any }
      if (!window.utools) return

      if (type === 'add') {
        // 新增功能，同步到数据库
        window.utools.db.put(newValue)
        if (newValue.feature) {
          // 如果是需要同步到utools的功能，则调用setFeature
          utools.setFeature({
            code: newValue.code,
            explain: newValue.explain,
            cmds: newValue.cmds,
            platform: ['win32', 'darwin', 'linux'],
          })
        }
      } else if (key === 'length' && newValue === target.length && oldValue > newValue) {
        utools.db.remove(store.$state.deleteId)
        utools.removeFeature(store.$state.deleteId)
        store.$state.deleteId = ''
      } else if (key === 'feature') {
        // 修改快捷启动
        const { code, explain, cmds, content } = target

        const data = window.utools.db.get(newValue.code)
        window.utools.db.put({
          _id: newValue.code,
          _rev: data?._rev,
          data: {
            code,
            explain,
            cmds,
            content,
          },
        })

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
        // 一次修改了很多东西

        utools.db.put(newValue)

        if (newValue.feature && !oldValue.feature) {
          // 如果是需要同步到utools的功能，则调用setFeature
          utools.setFeature({
            code: newValue.code,
            explain: newValue.explain,
            cmds: newValue.cmds,
            platform: ['win32', 'darwin', 'linux'],
          })
        } else if (!newValue.feature && oldValue.feature) {
          // 如果是需要同步到utools的功能，则调用removeFeature
          utools.removeFeature(oldValue.code)
        }
      }
    },
    {
      detached: true,
    },
  )
}
