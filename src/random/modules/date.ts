import dayjs from 'dayjs'

// 生成时间戳
export const timestamp = (): number => {
  // 随机返回一个有效的13位时间戳
  return Math.floor(Math.random() * (new Date().getTime() - 1000000000000)) + 1000000000000
}

// 星期
export const week = (): number => {
  const number = Math.floor(Math.random() * 7) + 1
  const strArr: { [index: number]: string } = ['一', '二', '三', '四', '五', '六', '日']
  // @ts-ignore
  return `星期${strArr[number]}`
}

export const date = (format: string = 'Y-M-D') => {
  return dayjs(timestamp()).format(format)
}
