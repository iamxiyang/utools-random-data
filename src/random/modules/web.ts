import random from 'lodash.random'
import sample from 'lodash.sample'
import { uuid } from './other'
import { useRegexp } from './regexp'

// 邮箱
export const email = () => {
  // 随机字符@随机域名
  return `${uuid().substring(0, 4).toLowerCase()}@${domain(false)}`
}
// 网址
export const url = () => {
  /* 
  可能的URL：
  域名/index.html
  域名/article_abc.html
  域名/2022/12.html
  域名/abc.html?q=1
  */
  return `${domain()}/${uuid().substring(0, 4).toLowerCase()}.html`
}

// 域名
export const domain = (showProtocol: boolean = true) => {
  // 域名协议
  const protocol = ['http://', 'https://']
  // 域名后缀
  const suffix = ['com', 'cn', 'net', 'xyz', 'vip', 'site', 'com.cn']
  return `${showProtocol ? sample(protocol) : ''}${useRegexp(/([a-z0-9]{4,8})/)}.${sample(suffix)}`
}

// ipv4
export const ipv4 = () => {
  return `${random(255)}.${random(255)}.${random(255)}.${random(255)}`
}

// ipv6
export const ipv6 = () => {
  return `${random(65535, true)}.${random(65535, true)}.${random(65535, true)}.${random(65535, true)}`
}

// ip
export const ip = () => {
  // 随机返回ipv4或ipv6
  return random(1) ? ipv4() : ipv6()
}

// mac地址
export const mac = () => {
  return `${random(255, true).toString(16).padStart(2, '0')}-${random(255, true).toString(16).padStart(2, '0')}-${random(255, true).toString(16).padStart(2, '0')}-${random(255, true).toString(16).padStart(2, '0')}-${random(255, true).toString(16).padStart(2, '0')}-${random(255, true)
    .toString(16)
    .padStart(2, '0')}`
}

// 图片地址
export const img = (w: string | number = 100, h: string | number = 100) => {
  return `https://dummyimage.com/${w}x${h}`
}

// 音频地址
export const audio = () => {
  return ' '
}
