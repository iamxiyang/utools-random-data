// 存放一些自定义变量的实现，用于给用户当做参考

const tips = `// 为了便于使用，内置了一些常用的库，具体用法可参考对应文档
// _dayjs: dayjs,
// _clonedeep: clonedeep, //lodash.clonedeep 深拷贝
// _isequal: isequal, //lodash.isequal 深比较
// _random: random, //lodash.random 生成随机数
// _sample: sample, //lodash.sample 从集合中获得一个随机元素。
// _times: times, //lodash.times 调用 iteratee n 次，每次调用返回的结果存入到数组中
// 正常的 JavaScript 代码都可以书写，最终需要 return，返回值将作为变量的值
`

const lunyuStr = `
${tips}
return _sample([
  '知者乐水，仁者乐山。',
  '志当存高远。',
  '言必信，行必果。',
  '人而无信，不知其可也。',
  '鞠躬尽瘁，死而后已。',
  '敏而好学，不耻下问。',
  '君子坦荡荡，小人长戚戚。',
  '自行束修以上，吾未尝无诲焉。',
  '己所不欲，勿施于人。',
  '学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？',
  '先进于礼乐，野人也；后进于礼乐，君子也。如用之，则吾从先进。',
  // ... 可以在下面继续完善
])
`

const tuhuaStr = `
${tips}
return _sample([
 "在你孤单的时候有人陪伴你，在你失落的时候有人帮助你。幸福就是无论你走到天涯海角，总会有人牵挂你！",
 "世间即使多可怕，总留下你依然让我值得牵挂。",
 "把自己当傻瓜，不懂就问，你会学的更多。",
])`

// TODO  自定义变量不再支持传参，当前写法作废，需要改成内置
const feihuaStr = `
function 文本(minLength = 200, maxLength = 200) {
  const chars = "的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型村穿弟李背景飞收转刻造户证切站黑层站随尔尤至确酒需价";
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
`

const 星座STR = `
${tips}
return _sample(['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'])`

// 随机返回一个有效的13位时间戳
const 时间戳 = `
${tips}
return Math.floor(Math.random() * (new Date().getTime() - 1000000000000)) + 1000000000000
`

const 星期 = `
${tips}
return _sample(['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'])
`

// // 车牌号
// export const carNumber = (newEnergy: boolean = false) => {
//   // 部分城市的简称
//   const province = ['京', '津', '冀', '浙', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '桂', '川', '贵', '新']
//   // 英文字母
//   const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
//   const number = `${sample(province)}${sample(letter)}${uuid().toUpperCase()}`
//   return newEnergy ? number.substr(0, 8) : number.substr(0, 7)
// }

// import sample from 'lodash.sample'
// import random from 'lodash.random'

// const rgb = () => {
//   return `rgb(${random(255)},${random(255)},${random(255)})`
// }

// const rgba = () => {
//   return `rgba(${random(255)},${random(255)},${random(255)},${random(1)})`
// }

// const hsl = () => {
//   return `hsl(${random(360)},${random(100)}%,${random(100)}%)`
// }

// const hsla = () => {
//   return `hsla(${random(360)},${random(100)}%,${random(100)}%,${random(1)})`
// }

// const hex = () => {
//   return `#${random(0xffffff).toString(16)}`
// }

// export const color = (type: 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hex' | undefined = undefined) => {
//   const arr = [rgb(), rgba(), hsl(), hsla(), hex()]
//   const obj = {
//     rgb: arr[0],
//     rgba: arr[1],
//     hsl: arr[2],
//     hsla: arr[3],
//     hex: arr[4],
//   }
//   return type && obj[type] ? obj[type] : sample(arr)
// }

// 生成时间戳
// export const timestamp = (): number => {
//   return Math.floor(Math.random() * (new Date().getTime() - 1000000000000)) + 1000000000000
// }

// export const date = (format: string = 'YYYY-MM-DD') => {
//   return dayjs(timestamp()).format(format)
// }

// // 邮箱
// export const email = () => {
//   // 随机字符@随机域名
//   return `${uuid().substring(0, 4).toLowerCase()}@${domain(false)}`
// }
// // 网址
// export const url = () => {
//   /*
//   可能的URL：
//   域名/index.html
//   域名/article_abc.html
//   域名/2022/12.html
//   域名/abc.html?q=1
//   */
//   return `${domain()}/${uuid().substring(0, 4).toLowerCase()}.html`
// }

// // 域名
// export const domain = (showProtocol: boolean = true) => {
//   // 域名协议
//   const protocol = ['http://', 'https://']
//   // 域名后缀
//   const suffix = ['com', 'cn', 'net', 'xyz', 'vip', 'site', 'com.cn']
//   return `${showProtocol ? sample(protocol) : ''}${useRegexp(/([a-z0-9]{4,8})/)}.${sample(suffix)}`
// }

// // ipv4
// export const ipv4 = () => {
//   return `${random(255)}.${random(255)}.${random(255)}.${random(255)}`
// }

// // ipv6
// export const ipv6 = () => {
//   // 随机生成ipv6地址
//   return `${useRegexp(/([A-F0-9]{4})/g)}:${useRegexp(/([A-F0-9]{4})/g)}:${useRegexp(/([A-F0-9]{4})/g)}:${useRegexp(/([A-F0-9]{4})/g)}:${useRegexp(/([A-F0-9]{4})/g)}:${useRegexp(/([A-F0-9]{4})/g)}:${useRegexp(/([A-F0-9]{4})/g)}`
// }

// // ip
// export const ip = () => {
//   // 随机返回ipv4或ipv6
//   return random(1) ? ipv4() : ipv6()
// }

// // mac地址
// export const mac = () => {
//   // 随机生成mac地址
//   return `${useRegexp(/([A-F0-9]{2})/g)}:${useRegexp(/([A-F0-9]{2})/g)}:${useRegexp(/([A-F0-9]{2})/g)}:${useRegexp(/([A-F0-9]{2})/g)}:${useRegexp(/([A-F0-9]{2})/g)}:${useRegexp(/([A-F0-9]{2})/g)}`
// }

// // 图片地址
// export const img = (w: string | number = 1000, h: string | number = w) => {
//   return `https://dummyimage.com/${w}x${h}?text=${new Date().getTime()}`
// }

// // 音频地址
// export const audio = () => {
//   return ' '
// }

export default [
  {
    _id: 'var-xingzuo',
    data: {
      name: '星座',
      code: 星座STR,
    },
  },
]
