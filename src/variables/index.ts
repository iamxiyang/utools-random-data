import { city, community, county, province, street } from './modules/address'
import { bankCard, bankCardNumber } from './modules/bank'
import { companyName } from './modules/other'
import { IdCard, phone, username } from './modules/people'
import { useRegexp } from './modules/regexp'

// 这里存放所有对外暴露的变量，key是变量使用词汇
export default {
  '${省}': {
    fun: province,
    example: province(),
    description: '随机返回一个省',
  },
  '${市}': {
    fun: city,
    example: city(),
    description: '城市，如果在省后面调用则肯定返回的是属于上级的',
  },
  '${县}': {
    fun: county,
    example: county(),
    description: '县，如果在省市后面调用则肯定返回的是属于上级的',
  },
  '${街道}': {
    fun: street,
    example: street(),
    description: '街道，如果在省市县后面调用则肯定返回的是属于上级的',
  },
  '${小区}': {
    fun: community,
    example: community(),
    description: '随机返回一个虚假的小区名称',
  },
  // '${学校}': {
  //   fun: school,
  //   example: school(),
  //   description: '随机返回一个大学名称，随机生成的，不确保真实存在',
  // },
  // '${快递地址}': {
  //   fun: express,
  //   example: express(),
  //   description: '随机返回一个快递地址，包含地址、手机、姓名',
  // },
  // '${地址}': {
  //   fun: address,
  //   example: address(),
  //   description: '随机返回一个地址，包含省市县街道等',
  // },
  // '${颜色}': {
  //   fun: color,
  //   example: color(),
  //   description: '可以传递一个类型，如 ${颜色(rgb)} ，支持rgb、rgba、hsl、hsla、hex，不传或传参不对将随机返回一种格式',
  // },
  // '${日期}': {
  //   fun: date,
  //   example: date(),
  //   description: '支持根据dayjs格式化标记返回特定格式内容，如 ${日期(YYYY-MM-DD)}，默认参数 YYYY-MM-DD',
  // },
  // '${星期}': {
  //   fun: week,
  //   example: week(),
  //   description: '随机返回一个日期，如 星期一、星期日',
  // },
  // '${时间戳}': {
  //   fun: timestamp,
  //   example: timestamp(),
  //   description: '随机一个时间的时间戳，精确到毫秒（13位）',
  // },
  // '${UUID}': {
  //   fun: uuid,
  //   example: uuid(),
  //   description: '随机返回一个UUID',
  // },
  // '${车牌号}': {
  //   fun: carNumber,
  //   example: carNumber(),
  //   description: '随机返回一个车牌号，支持传递一个参数选择返回新能源车牌号',
  // },
  '${手机号}': {
    fun: phone,
    example: phone(),
    description: '随机返回一个手机号码，支持传递一个参数是否返回 86+ 前缀',
  },
  // '${电话号码}': {
  //   fun: tel,
  //   example: tel(),
  //   description: '随机返回一个电话号码',
  // },
  '${姓名}': {
    fun: username,
    example: username(),
    description: '随机返回一个中文姓名',
  },
  '${身份证号}': {
    fun: IdCard,
    example: IdCard(),
    description: '随机返回一个符合规则的国内身份证号，支持传递最大年龄和最小年龄，如 ${身份证号(100)} 返回身份证最大在100岁， ${身份证号(100,20)} 返回的身份证号码年龄在20-100岁之间',
  },
  // '${星座}': {
  //   fun: constellation,
  //   example: constellation(),
  //   description: '随机返回一个星座',
  // },
  '${正则}': {
    fun: useRegexp,
    example: useRegexp(/[a-zA-Z0-9]{6,12}/),
    description: '实验性功能，后续可能更改！支持正则表达式，可以传递一个正则表达式，返回一个符合正则表达式的字符串，如 ${正则(/[a-zA-Z0-9]{6,12}/)} 依赖reregexp',
  },
  // '${文本}': {
  //   fun: text,
  //   example: text(40),
  //   description: '随机返回一段无规律的文本，支持传递文本长度，如 ${文本(100)} 返回的内容是固定 100个字符， ${文本(100,120)} 返回的内容是100~120个字符，默认是200个字符',
  // },
  // '${邮箱}': {
  //   fun: email,
  //   example: email(),
  //   description: '随机返回一个邮箱地址',
  // },
  // '${网址}': {
  //   fun: url,
  //   example: url(),
  //   description: '随机返回一个网址',
  // },
  // '${域名}': {
  //   fun: domain,
  //   example: domain(),
  //   description: '随机返回一个域名',
  // },
  // '${ipv4}': {
  //   fun: ipv4,
  //   example: ipv4(),
  //   description: '随机返回一个ipv4的地址',
  // },
  // '${ipv6}': {
  //   fun: ipv6,
  //   example: ipv6(),
  //   description: '随机返回一个ipv6的地址',
  // },
  // '${ip}': {
  //   fun: ip,
  //   example: ip(),
  //   description: '随机返回一个ipv4或ipv6的地址',
  // },
  // '${mac}': {
  //   fun: mac,
  //   example: mac(),
  //   description: '随机返回一个mac地址，如 5F-CF-71-76-57-B7',
  // },
  // '${图片地址}': {
  //   fun: img,
  //   example: img(),
  //   description: '随机返回一个图片地址，支持传递宽高，如 ${图片地址(200,300)} 返回的图片宽高为 200*300',
  // },
  '${银行卡}': {
    fun: bankCard,
    example: bankCard(),
    description: '随机返回一个银行卡信息',
  },
  '${银行卡号}': {
    fun: bankCardNumber,
    example: bankCardNumber(),
    description: '随机返回一个银行卡号',
  },
  '${公司名称}': {
    fun: companyName,
    example: companyName(),
    description: '随机返回一个公司名称',
  },
  // '${论语}': {
  //   fun: returnLunyu,
  //   example: returnLunyu(),
  //   description: '不建议继续使用，下个大版本将移除！',
  // },
  // '${土话}': {
  //   fun: returnTuhua,
  //   example: returnTuhua(),
  //   description: '不建议继续使用，下个大版本将移除！',
  // },
  // '${随机数}': {
  //   fun: random,
  //   example: random(),
  //   description: '建议减少使用该变量，下个大版本可能会有不兼容更改！随机返回数字，底层依赖lodash.random 可以查看lodash文档。默认返回0或1',
  // },
} as SystemVariablesObject
