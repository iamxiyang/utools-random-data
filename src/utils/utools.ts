import { debug } from './helper'

// 粘贴指令
export const paste = () => {
  if (utools.isMacOs()) {
    utools.simulateKeyboardTap('v', 'command')
  }
  if (utools.isWindows() || utools.isLinux()) {
    utools.simulateKeyboardTap('v', 'ctrl')
  }
}

const showTips = () => {
  utools.showNotification('生成的内容会自动尝试粘贴到你的输入框，如果没有自动输入，也可以手动粘贴使用，此提示只出现1次')
}

let isFirstUse = window.utools && !utools.dbStorage.getItem('is-first-use')

// 执行隐藏窗口、复制粘贴、退出插件步骤
export const copyPasteOut = (text: string) => {
  if (!window.utools) {
    debug('仅uTools插件环境可用', text)
    return
  }
  window.utools.hideMainWindow()
  utools.copyText(text)
  paste()
  if (isFirstUse) {
    showTips()
    utools.dbStorage.setItem('is-first-use', new Date().getTime())
    isFirstUse = false
  }
  window.utools.outPlugin()
}

export const tryRemoveFeature = (row: DbDoc) => {
  // 不知道具体原因，测试时发现内置指令删除时会报错，但尝试更新后再删除就不会报错，这里多尝试一次
  const { code, explain, cmds } = isRef(row) ? toRaw(row.data) : row.data
  const res = utools.removeFeature(row._id)
  if (!res) {
    utools.setFeature({
      code,
      explain,
      cmds,
      platform: ['win32', 'darwin', 'linux'],
    })
    utools.removeFeature(row._id)
  }
}
