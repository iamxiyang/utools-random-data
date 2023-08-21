import random from 'lodash.random'
import feihuaJSON from './text.json'

const choice = (a: 'title' | 'famous' | 'bosh' | 'after' | 'before') => {
  const arr = feihuaJSON[a]
  return arr[(Math.random() * arr.length) | 0]
}

// 随机生成一段废话
const returnFeihua = (length = 200, title = '随机一段废话') => {
  let body = ''
  while (body.length < length) {
    let num = (Math.random() * 100) | 0
    switch (true) {
      case num < 10:
        body += '\r\n'
        break
      case num < 20:
        body += choice('famous').replace('a', choice('before')).replace('b', choice('after'))
        break
      default:
        body += choice('bosh')
        body = body.replace('x', title)
    }
  }
  if (body.length > length) {
    return body.slice(0, length)
  }
  if (body.length < length) {
    return body.padEnd(length - body.length, '哈')
  }
  return body
}

export const text = (min: number = 200, max: number = min) => {
  return returnFeihua(random(min, max))
}
