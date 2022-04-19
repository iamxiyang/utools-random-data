import dayjs from 'dayjs'

// 生成时间戳
export const timestamp = (): number => {
  return Math.floor(Math.random() * 1000000000000)
}

// 星期
export const week = (): number => {
  const number = Math.floor(Math.random() * 7) + 1
  const strArr: { [index: number]: string } = ['一', '二', '三', '四', '五', '六', '日']
  // @ts-ignore
  return `星期${strArr[number]}`
}

// TODO 改成随机一个有效时间戳，根据 dayjs 按照一定格式转换返回

export const date = (format = 'Y-M-D') => {
  return dayjs(timestamp()).format(format)
}
