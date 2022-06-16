import variable from '../constant/variable'
import { _clearAddressCaches } from '../random'

// 解析内容
export const runCmd = (content: string) => {
  if (!content) return ''
  // 有可能的格式示例： ${日期} ${身份证号} ${随机数()} ${随机数(10)} ${随机数(10,20)}
  let tempCaches: { [key: string]: string } = {}
  const parseContent = content.replace(/\$\{(([.\S](?!\$))*)\}/gim, (match, p1, offset, string) => {
    // ${域名}
    // ${身份证号()}
    // ${文本()}
    // ${文本(10)}
    // ${文本(10,20)}
    // ${正则(/[a-zA-Z0-9]{6,12}/)}
    if (tempCaches[match]) {
      // 如果在一个内容中出现相同的变量，则始终返回相同内容
      return tempCaches[match]
    }
    // 解析方法名
    const fun = match.replace(/\(.*?\)/, '')
    // 解析出来参数
    const macthArguments = match.match(/\((.*?)\)/)?.[1] || ''
    let _arguments = fun === '${正则}' ? [macthArguments] : macthArguments.split(',')
    if (variable[fun]) {
      const result = variable?.[fun]?.function(..._arguments.filter((i) => i))
      // 缓存结果便于后续使用
      tempCaches[match] = result
      return result
    }
    return p1
  })
  _clearAddressCaches()
  return parseContent.trim()
}
