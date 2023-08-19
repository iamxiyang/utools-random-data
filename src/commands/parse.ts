import { useAppStore } from '../store/app.store'
import { evaluate } from '../utils/variable'
import { _clearAddressCaches } from '../variables/modules/address'

// 解析内容
export const runCmd = (content: string) => {
  const appStore = useAppStore()
  if (!content) return ''
  let tempCaches: { [key: string]: string } = {}
  const parseContent = content.replace(/\$\{(正则\(.*?\)|.*?)(?!\$\{)\}/gim, (match, p1, offset, string) => {
// ${域名}
    // ${身份证号()}
    // ${文本()}
    // ${文本(10)}
    // ${文本(10,20)}
    // ${正则(/[a-zA-Z0-9]{6,12}/)}
    // ${日期(YYYY-MM-DD HH:mm:ss)}
    // ${日期(YYYY-MM-DDHH:mm:ss)}
    // {"accountType":1,"username":"${时间戳}","mobile":"${手机号}","email":"${邮箱}","roleIdList":[2],"isSecondConfirm":true,"deptId":120,"id":null}
    if (tempCaches[match]) {
      // 如果在一个内容中出现相同的变量，则始终返回相同内容
      return tempCaches[match]
    }
    // 解析方法名
    const fun = match.replace(/\(.*?\)/, '')
    // 解析出来参数
    const macthArguments = match.match(/\((.*?)\)/)?.[1] || ''
    let _arguments = fun === '${正则}' ? [macthArguments] : macthArguments.split(',')

    const variable = appStore.allVariablesObject[fun]

    if (variable) {
      let result

      if ((variable as Variables).code) {
        result = evaluate((variable as Variables).code)
      }

      if ((variable as SystemVariables).fun) {
        result = (variable as SystemVariables)?.fun(..._arguments.filter((i) => i))
      }

      // 缓存结果便于后续使用
      tempCaches[match] = result
      return result
    }

    return `\${${p1}}`
  })
  _clearAddressCaches()
  return parseContent.trim()
}
