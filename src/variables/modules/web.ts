import sample from 'lodash.sample'
import { useRegexp } from './regexp'
import { UUID } from './other'

// 邮箱
export const email = () => {
  // 随机字符@随机域名
  return `${UUID().substring(0, 4).toLowerCase()}@${domain(false)}`
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
  return `${domain()}/${UUID().substring(0, 4).toLowerCase()}.html`
}

// 域名
export const domain = (showProtocol: boolean = true) => {
  // 域名协议
  const protocol = ['http://', 'https://']
  // 域名后缀
  const suffix = ['com', 'cn', 'net', 'xyz', 'vip', 'site', 'com.cn']
  return `${showProtocol ? sample(protocol) : ''}${useRegexp(/([a-z0-9]{4,8})/)}.${sample(suffix)}`
}

// 图片地址
export const img = (w: string | number = 1000, h: string | number = w) => {
  return `https://dummyimage.com/${w}x${h}?text=${new Date().getTime()}`
}
