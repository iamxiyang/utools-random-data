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
