import { address, city, county, express, province, school, street } from './modules/address'
import { bankCard, bankCardNumber } from './modules/bank'
import { UUID, carNumber, companyName, date, mac } from './modules/other'
import { IdCard, phone, username } from './modules/people'
import { useRegexp } from './modules/regexp'
import { text } from './modules/text'
import { domain, email, img, url } from './modules/web'

// 这里存放所有对外暴露的内置变量，key是变量使用词汇
export default {
  省: {
    fun: province,
    example: province(),
    explain: '随机返回一个省',
  },
  市: {
    fun: city,
    example: city(),
    explain: '城市，如果在省后面调用则肯定返回的是属于上级的',
  },
  县: {
    fun: county,
    example: county(),
    explain: '县，如果在省市后面调用则肯定返回的是属于上级的',
  },
  街道: {
    fun: street,
    example: street(),
    explain: '街道，如果在省市县后面调用则肯定返回的是属于上级的',
  },

  学校: {
    fun: school,
    example: school(),
    explain: '随机返回一个大学名称，随机生成的，不是真实存在',
  },
  快递地址: {
    fun: express,
    example: express(),
    explain: '随机返回一个快递地址，包含地址、手机、姓名',
  },
  地址: {
    fun: address,
    example: address(),
    explain: '随机返回一个地址，包含省市县街道等',
  },

  日期: {
    fun: date,
    example: date(),
    explain: '支持根据dayjs格式化标记返回特定格式内容，如 日期(YYYY-MM-DD)}，默认参数 YYYY-MM-DD，复杂需求建议尝试自定义变量',
  },
  UUID: {
    fun: UUID,
    example: UUID(),
    explain: '随机返回一个UUID',
  },
  手机号: {
    fun: phone,
    example: phone(),
    explain: '随机返回一个手机号码，支持传递一个参数是否返回 86+ 前缀',
  },
  姓名: {
    fun: username,
    example: username(),
    explain: '随机返回一个中文姓名',
  },
  正则: {
    fun: useRegexp,
    example: useRegexp(/[a-zA-Z0-9]{6,12}/),
    explain: '支持正则表达式，需要传递一个正则表达式，返回一个符合正则表达式的字符串，如 正则(/[a-zA-Z0-9]{6,12}/)} 依赖reregexp',
  },

  邮箱: {
    fun: email,
    example: email(),
    explain: '随机返回一个邮箱地址',
  },
  网址: {
    fun: url,
    example: url(),
    explain: '随机返回一个网址',
  },
  域名: {
    fun: domain,
    example: domain(),
    explain: '随机返回一个域名',
  },
  公司名称: {
    fun: companyName,
    example: companyName(),
    explain: '随机返回一个公司名称',
  },
  mac地址: {
    fun: mac,
    example: mac(),
    explain: '随机返回一个Mac地址',
  },
  身份证号: {
    fun: IdCard,
    example: IdCard(),
    explain: '建议使用自定义变量替代。随机返回一个符合规则的国内身份证号',
  },
  车牌号: {
    fun: carNumber,
    example: carNumber(),
    explain: '建议使用自定义变量替代。随机返回一个车牌号',
  },
  银行卡: {
    fun: bankCard,
    example: bankCard(),
    explain: '建议使用自定义变量替代。随机返回一个银行卡信息',
  },
  银行卡号: {
    fun: bankCardNumber,
    example: bankCardNumber(),
    explain: '建议使用自定义变量替代。随机返回一个银行卡号',
  },
  文本: {
    fun: text,
    example: text(40),
    explain: '可能废弃，建议使用自定义变量替代。随机返回一段无规律的文本，支持传递文本长度，如 文本(100)} 返回的内容是固定 100个字符， 文本(100,120)} 返回的内容是100~120个字符，默认是200个字符',
  },
  图片地址: {
    fun: img,
    example: img(),
    explain: '可能废弃，建议使用自定义变量替代。随机返回一个图片地址，支持传递宽高，如 图片地址(200,300)} 返回的图片宽高为 200*300',
  },
} as SystemVariablesObject
