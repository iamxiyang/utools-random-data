import {
  city,
  color,
  address,
  county,
  express,
  hex,
  hsl,
  hsla,
  IdCard,
  postcode,
  province,
  rgba,
  school,
  street,
  rgb,
  community,
  year,
  month,
  date,
  hour,
  minute,
  second,
  YMD,
  YMDHMS,
  week,
  timestamp,
  uuid,
  carNumber,
  username,
  phone,
  tel,
  useRegexp,
  text,
  audio,
  img,
  ip,
  domain,
  url,
  email,
  constellation,
} from '../random/index'

// 内置变量
const funName: { [key: string]: any } = {
  '${省}': province,
  '${市}': city,
  '${县}': county,
  '${街道}': street,
  '${邮编}': postcode,
  '${小区}': community,
  '${学校}': school,
  '${快递地址}': express,
  '${地址}': address,
  '${rgb}': rgb,
  '${rgba}': rgba,
  '${hsl}': hsl,
  '${hsla}': hsla,
  '${hex}': hex,
  '${颜色}': color,
  '${年}': year,
  '${月}': month,
  '${日}': date,
  '${时}': hour,
  '${分}': minute,
  '${秒}': second,
  '${日期}': YMD,
  '${年月日时分秒}': YMDHMS,
  '${星期}': week,
  '${时间戳}': timestamp,
  '${UUID}': uuid,
  '${车牌号}': carNumber,
  '${手机号}': phone,
  '${电话号码}': tel,
  '${姓名}': username,
  '${身份证号}': IdCard,
  '${星座}': constellation,
  '${正则}': useRegexp,
  '${文本}': text,
  '${邮箱}': email,
  '${网址}': url,
  '${域名}': domain,
  '${ip}': ip,
  '${图片地址}': img,
  // '${音频地址}': audio,
}

// 解析内容
export const runCmd = (content: string) => {
  if (!content) return ''
  // 有可能的格式示例： ${日期} ${身份证号} ${随机数()} ${随机数(10)} ${随机数(10,20)}
  let tempCaches: { [key: string]: string } = {}
  const parseContent = content.replace(/(\${.+?})/g, (match, p1, offset, string) => {
    if (tempCaches[match]) {
      // 如果在一个内容中出现相同的变量，则始终返回相同内容
      return tempCaches[match]
    }
    // 解析方法名
    const fun = match.replace(/\(.*?\)/, '')
    // 解析出来参数
    const macthArguments = match.match(/\((.*?)\)/)?.[1] || ''
    let _arguments = macthArguments.split(',')
    if (funName[fun]) {
      const result = funName[fun](..._arguments)
      // 缓存结果便于后续使用
      tempCaches[match] = result
      return result
    }
    return p1
  })
  return parseContent
}
