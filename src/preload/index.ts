export * from './variable'

utools.onPluginDetach(() => {
  console.log('插件应用已作为系统窗口使用')
  window.isDetach = true
})

// utools.onDbPull(() => {
//   // 当此插件应用的数据在其他设备上被更改后同步到此设备时，uTools 将会主动调用这个方法
//   console.log('onDbPull')
// })

// 执行该方法将会退出当前插件应用。（插件应用进入后台，进程并未结束）
// outPlugin()

// hideMainWindowTypeString(text)
// text String

// 任意文本包括 Emoji 符号字符

// 隐藏主窗口键盘输入字符串(输入法原理)，插件应用应用未分离下才能正常执行
