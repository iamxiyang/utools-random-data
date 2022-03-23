// 年
export const year = (max: number = 22): number => {
  return Math.floor(Math.random() * max) + 2000
}

// 月
export const month = (): number => {
  return Math.floor(Math.random() * 12) + 1
}

// 日
export const date = (): number => {
  return Math.floor(Math.random() * 30) + 1
}

// 时
export const hour = () => {
  return Math.floor(Math.random() * 24) + 1
}

// 分
export const minute = () => {
  return Math.floor(Math.random() * 60) + 1
}

// 秒
export const second = () => {
  return Math.floor(Math.random() * 60) + 1
}

// 生成时间戳
export const timestamp = (): number => {
  return Math.floor(Math.random() * 1000000000000)
}

// 年月日
export const YMD = (config: { [key: string]: number } = {}): string => {
  return `${year(config.year)}-${month()}-${date()}`
}

// 具体时间
export const YMDHMS = (config: { [key: string]: number } = {}): string => {
  return `${year(config.year)}-${month()}-${date()} ${hour()}:${minute()}:${second()}`
}

// 星期
export const week = (): number => {
  const number = Math.floor(Math.random() * 7) + 1
  const strArr: { [index: number]: string } = ['一', '二', '三', '四', '五', '六', '日']
  // @ts-ignore
  return `星期${strArr[number]}`
}
