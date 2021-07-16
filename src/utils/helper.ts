export const random = (Min = 0, Max) => {
  var Range = Max - Min
  var Rand = Math.random()
  return Min + Math.round(Rand * Range)
}

// 从数组中随机选取一个元素，并返回。
export const pick = (arr) => {
  if (!Array.isArray(arr)) {
    return
  }
  return arr[random(0, arr.length - 1)]
}

function range(defaultMin, defaultMax, min, max) {
  return min === undefined
    ? random(defaultMin, defaultMax) // ()
    : max === undefined
    ? min // ( len )
    : random(parseInt(min, 10), parseInt(max, 10)) // ( min, max )
}

// 返回一个随机字符。
export const character = (pool) => {
  var pools = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    symbol: '!@#$%^&*()[]',
  }
  pools['undefined'] = pools.lower + pools.upper + pools.number + pools.symbol

  pool = pools[('' + pool).toLowerCase()] || pool
  return pool.charAt(random(0, pool.length - 1))
}

export const word = (min = 3, max = 10) => {
  var len = range(3, 10, min, max)
  var result = ''
  for (var i = 0; i < len; i++) {
    result += character('lower')
  }
  return result
}

// 对于小于10的数字补全0
export const addZero = (str: any, num: any) => {
  str = str.toString()
  for (let i = 0, len = num - str.length; i < len; i++) {
    str = '0' + str
  }
  return str
}

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
export const copyPasteOut = (text) => {
  window.utools.hideMainWindow()
  utools.copyText(text)
  paste()
  window.utools.outPlugin()
}
