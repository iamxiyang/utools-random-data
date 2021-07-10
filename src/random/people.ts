import { pick, random } from '../utils/helper'

/* 模拟生成 不包含 香港、澳门、台湾、国外 的其他省份省会城市的身份证号
 * 参考：https://codepen.io/win7killer/pen/qudhG 原作者 : win7killer
 */
const id = {
  aProvince: [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65],
  aCity: ['0101', '0201'],
  sId: '',
  iBirDate: '',
  repTimes: 50,
}
const addZero = (str, num) => {
  str = str.toString()
  for (var i = 0, len = num - str.length; i < len; i++) {
    str = '0' + str
  }
  return str
}

const idtoProvince = () => {
  return id.aProvince[random(0, id.aProvince.length - 1)] //不包含 香港、澳门、台湾、国外
}
const idtoCity = () => {
  return id.aCity[random(0, id.aCity.length - 1)]
}
const idtoBirthday = () => {
  var ia = new Date()
  var start = new Date().getTime() - 50 * 365 * 24 * 60 * 60 * 1000
  var end = new Date().getTime() - 18 * 365 * 24 * 60 * 60 * 1000
  var ageDate = random(start, end)
  ia.setTime(ageDate)
  return ia.getFullYear() + '' + addZero(ia.getMonth() + 1, 2) + addZero(ia.getDate(), 2) //随机生日
}
const idtoLast = () => {
  for (var i = 0, arrLastFour = []; i < 4; i++) {
    arrLastFour.push(random(0, 9))
  }
  return arrLastFour.join('')
}
const idtoId = () => {
  let sId = ''
  for (var j = 0; j < 50; j++) {
    sId = '' + idtoProvince() + '' + idtoCity() + idtoBirthday() + idtoLast()
    var iSum = 0
    for (var i = 17; i >= 0; i--) {
      iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11)
    }
    if (iSum % 11 == 1) {
      console && console.log(sId + '   ////////   ' + j)
      return sId
    }
  }
}

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

const phone = () => {
  return phonePrefixs[random(0,phonePrefixs.length - 1)] + String(random(10000000, 99999999))
}

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

const name = () => {
  return pick(firstName) + pick(lastName)
}

export default {
  name,
  phone,
  idcard: idtoId,
}