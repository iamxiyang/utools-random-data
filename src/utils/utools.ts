import { debug } from '.'

// 粘贴指令
export const paste = () => {
  if (utools.isMacOS()) {
    utools.simulateKeyboardTap('v', 'command')
  }
  if (utools.isWindows() || utools.isLinux()) {
    utools.simulateKeyboardTap('v', 'ctrl')
  }
}

const showTips = () => {
  utools.showNotification('生成的内容会自动尝试粘贴到你的输入框，如果没有自动输入，也可以手动粘贴使用，此提示只出现1次')
}

let isFirstUse = !utools?.dbStorage?.getItem('is-first-use')

// 执行隐藏窗口、复制粘贴、退出插件步骤
export const copyPasteOut = (text: string) => {
  window.utools.hideMainWindow()
  utools.copyText(text)
  paste()

  if (isFirstUse) {
    showTips()
    utools.dbStorage.setItem('is-first-use', new Date().getTime())
    isFirstUse = false
  } else if (window.isDetach) {
    utools.showNotification('数据已生成，分离窗口下会影响自动粘贴，请手动粘贴使用，建议关闭分离窗口')
  }

  utools.outPlugin()
}
