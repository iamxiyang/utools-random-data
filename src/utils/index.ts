export const debug = (...args: any) => {
  if (utools.isDev?.()) {
    console.log(...args)
  }
}

export const openUrl = (url: string) => {
  window.utools ? utools.shellOpenExternal(url) : window.open(url, '_blank')
}

export const copyText = (text: string) => {
  window.utools ? utools.copyText(text) : navigator.clipboard.writeText(text)
}
