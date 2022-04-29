export const debug = (...args: any) => {
  if (!utools || utools.isDev()) {
    console.log(...args)
  }
}

export const openUrl = (url: string) => {
  window.utools ? utools.shellOpenExternal(url) : window.open(url, '_blank')
}
