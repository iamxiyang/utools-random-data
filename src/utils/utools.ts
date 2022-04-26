// 粘贴指令
export const paste = () => {
  if (utools.isMacOs()) {
    utools.simulateKeyboardTap('v', 'command')
  }
  if (utools.isWindows() || utools.isLinux()) {
    utools.simulateKeyboardTap('v', 'ctrl')
  }
}

// 执行隐藏窗口、复制粘贴、退出插件步骤
export const copyPasteOut = (text: string) => {
  if (!window.utools) {
    console.log('仅uTools插件环境可用', text)
    return
  }
  window.utools.hideMainWindow()
  utools.copyText(text)
  paste()
  window.utools.outPlugin()
}

/* 
_id:'cmd-随机数',
_rev:'',
data:{
  data里和功能配置一样的，但额外多了 feature ，表示是否需要同步到utools功能
  code:'和id保持一致',
}

*/

// 同步数据库，需要传 _id、data，如果是更新还需要传 _rev

// 删除数据库，需要传 整个文档或文档id

// // 新增功能,
// export const setFeature = (options: DbFeature) => {
//   const {
//     data: { code, cmds, explain },
//   } = options
//   utools.setFeature({
//     code,
//     explain,
//     cmds,
//     platform: ['win32', 'darwin', 'linux'],
//   })
// }

// // 删除功能，需要传 code/id

// export const delFeature = (options: DbFeature) => {}

// 这里处理增加了一条数据相关逻辑
const addFeature = (newValue) => {
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
}

// 这里处理修改逻辑
const updateFeature = (newValue) => {
  // 获取db这个code的数据得到 rev
  const oldValue = window.utools.db.get(newValue.code)
  if (!oldValue?._rev) {
    // 如果不存在 _rev ，调用 新增逻辑
    addFeature(newValue)
    return
  }
  //  直接修改数据库
  window.utools.db.put({
    ...oldValue,
    ...newValue,
  })
  // 如果oldValue的feature是真，先删掉utools的功能
  if (oldValue?.feature) {
    utools.removeFeature(oldValue.code)
  }
  if (newValue.feature) {
    utools.setFeature({
      code: newValue.code,
      explain: newValue.explain,
      cmds: newValue.cmds,
      platform: ['win32', 'darwin', 'linux'],
    })
  }
}

// 删除的逻辑
const delFeature = (newValue) => {
  const oldValue = window.utools.db.get(newValue.code)
  if (oldValue?.data.feature) {
    utools.removeFeature(newValue.code)
  }
  utools.db.remove(newValue.code)
}

// 再写一个统一的utools逻辑，派发到各个不同的子逻辑里面
