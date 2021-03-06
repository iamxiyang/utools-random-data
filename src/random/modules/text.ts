import random from 'lodash.random'
import sample from 'lodash.sample'
import textJson from './text.json'

const { lunyu, tuhua, feihua } = textJson

// 随机返回一句论语
export const returnLunyu = () => {
  return sample(lunyu)
}

// 随机返回一句土话
export const returnTuhua = () => {
  return sample(tuhua)
}

const choice = (a: 'title' | 'famous' | 'bosh' | 'after' | 'before') => {
  const arr = feihua[a]
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
