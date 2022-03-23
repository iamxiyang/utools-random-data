import sample from 'lodash.sample'
import textJson from './text.json'

const { lunyu, tuhua, feihua } = textJson

// 随机返回一句论语
const returnLunyu = () => {
  return sample(lunyu)
}

// 随机返回一句土话
const returnTuhua = () => {
  return sample(tuhua)
}

const choice = (a: 'title' | 'famous' | 'bosh' | 'after' | 'before') => {
  const arr = feihua[a]
  return arr[(Math.random() * arr.length) | 0]
}

// 随机生成一段废话
const returnFeihua = (title = '随机一段废话', length = 1000) => {
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
  return body
}

export const text = (config: { length?: number; type: string; title?: string } = { type: 'feihua' }) => {
  const { type, length } = config
  switch (type) {
    case 'lunyu':
      return returnLunyu()
    case 'tuhua':
      return returnTuhua()
    case 'feihua':
      return returnFeihua(config.title, length)
    default:
      return returnLunyu()
  }
}
