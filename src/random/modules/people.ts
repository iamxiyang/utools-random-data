import sample from 'lodash.sample'
import random from 'lodash.random'

// 手机号
export const phone = (prefix: boolean = false) => {
  // 手机号前缀来源：https://baike.baidu.com/item/%E7%94%B5%E8%AF%9D%E5%8F%B7%E7%A0%81/1417271
  const phonePrefixs = [
    '134',
    '135',
    '136',
    '137',
    '138',
    '139',
    '147',
    '150',
    '151',
    '152',
    '157',
    '158',
    '159',
    '172',
    '178',
    '182',
    '183',
    '184',
    '187',
    '188',
    '195',
    '197',
    '198',
    '130',
    '131',
    '132',
    '145',
    '155',
    '156',
    '166',
    '175',
    '176',
    '185',
    '186',
    '196',
    '133',
    '149',
    '153',
    '180',
    '181',
    '189',
    '173',
    '177',
    '190',
    '191',
    '193',
    '199',
  ]
  const num = sample(phonePrefixs) + String(random(10000000, 99999999))
  return prefix ? `+86${num}` : num
}

// 电话号码
export const tel = () => {
  return '0' + Math.floor(Math.random() * 10000000000)
}

// 姓名
export const username = () => {
  // 常见的中文姓
  const firstName = (
    '王 李 张 刘 陈 杨 赵 黄 周 吴 ' +
    '徐 孙 胡 朱 高 林 何 郭 马 罗 ' +
    '梁 宋 郑 谢 韩 唐 冯 于 董 萧 ' +
    '程 曹 袁 邓 许 傅 沈 曾 彭 吕 ' +
    '苏 卢 蒋 蔡 贾 丁 魏 薛 叶 阎 ' +
    '余 潘 杜 戴 夏 锺 汪 田 任 姜 ' +
    '范 方 石 姚 谭 廖 邹 熊 金 陆 ' +
    '郝 孔 白 崔 康 毛 邱 秦 江 史 ' +
    '顾 侯 邵 孟 龙 万 段 雷 钱 汤 ' +
    '尹 黎 易 常 武 乔 贺 赖 龚 文'
  ).split(' ')
  // 常见的中文名
  const lastName = ('伟 芳 娜 秀英 敏 静 丽 强 磊 军 ' + '洋 勇 艳 杰 娟 涛 明 超 秀兰 霞 ' + '平 刚 桂英').split(' ')
  // @ts-ignore
  return sample(firstName) + sample(lastName)
}

// 身份证号
export const IdCard = () => {
  // 身份证号码生成，规则参考：https://baike.baidu.com/item/%E5%B1%85%E6%B0%91%E8%BA%AB%E4%BB%BD%E8%AF%81%E5%8F%B7%E7%A0%81/3400358

  // 第一、二位表示省级行政区。
  const province = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65]
  // 第三、四位表示地级行政区；第五、六位表示县级行政区。
  const city = ['0101', '0201']

  // 随机生成一个生日
  const birthday = (separator = '') => {
    const date = new Date()
    const start = date.getTime() - 50 * 365 * 24 * 60 * 60 * 1000
    const end = date.getTime() - 18 * 365 * 24 * 60 * 60 * 1000
    const ageDate = random(start, end)
    date.setTime(ageDate)
    return `${date.getFullYear()}${separator}${String(date.getMonth() + 1).padStart(2, '0')}${separator}${String(date.getDate()).padStart(2, '0')}`
  }

  // 根据前17位计算第18位效验码
  const getValidationCode = (total: any) => {
    const remainder = total % 11
    const arr = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    return arr[remainder]
  }

  let iSum = 0
  // @ts-ignore
  const sId = sample(province) + sample(city) + birthday() + String(random(100, 999))
  for (let i = 17; i >= 1; i--) {
    iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
  }
  return sId + getValidationCode(iSum)
}

// 星座
export const constellation = () => {
  const constellations = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
  return sample(constellations)
}
