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

const 论语 = `
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

const 土话 = `
${tips}
return _sample([
 "在你孤单的时候有人陪伴你，在你失落的时候有人帮助你。幸福就是无论你走到天涯海角，总会有人牵挂你！",
 "世间即使多可怕，总留下你依然让我值得牵挂。",
 "把自己当傻瓜，不懂就问，你会学的更多。",
])
`

const 星座 = `
${tips}
return _sample(['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'])
`

// 随机返回一个有效的13位时间戳
const 时间戳 = `
${tips}
return Math.floor(Math.random() * (new Date().getTime() - 1000000000000)) + 1000000000000
`

const 星期 = `
${tips}
return _sample(['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'])
`

const rgb颜色 = `
${tips}
return \`rgb(\${_random(255)},\${_random(255)},\${_random(255)})\`
`

const ipv4 = `
${tips}
return \`\${_random(255)}.\${_random(255)}.\${_random(255)}.\${_random(255)}\`
`

const ipv6 = `
${tips}
return Array.from({ length: 8 }, () => Math.floor(Math.random() * 65535).toString(16)).join(':')
`

const ip = `
${tips}

const ipv4 = () => {
  return \`\${_random(255)}.\${_random(255)}.\${_random(255)}.\${_random(255)}\`
}
const ipv6 = () => {
  return Array.from({ length: 8 }, () => Math.floor(Math.random() * 65535).toString(16)).join(':')
}

return _random() > 0.5 ? ipv4() : ipv6()
`

const 电话号码 = `
${tips}
return \`0\${Math.floor(Math.random() * 10000000000)}\`
`

const 姓名 = `
${tips}
const firstName=[
    '王',
    '李',
    '张',
    '刘',
    '陈',
    '杨',
    '赵',
    '黄',
    '周',
    '吴',
    '徐',
    '孙',
    '胡',
    '朱',
    '高',
    '林',
    '何',
    '郭',
    '马',
    '罗',
    '梁',
    '宋',
    '郑',
    '谢',
    '韩',
    '唐',
    '冯',
    '于',
    '董',
    '萧',
    '程',
    '曹',
    '袁',
    '邓',
    '许',
    '傅',
    '沈',
    '曾',
    '彭',
    '吕',
    '苏',
    '卢',
    '蒋',
    '蔡',
    '贾',
    '丁',
    '魏',
    '薛',
    '叶',
    '阎',
    '余',
    '潘',
    '杜',
    '戴',
    '夏',
    '锺',
    '汪',
    '田',
    '任',
    '姜',
    '范',
    '方',
    '石',
    '姚',
    '谭',
    '廖',
    '邹',
    '熊',
    '金',
    '陆',
    '郝',
    '孔',
    '白',
    '崔',
    '康',
    '毛',
    '邱',
    '秦',
    '江',
    '史',
    '顾',
    '侯',
    '邵',
    '孟',
    '龙',
    '万',
    '段',
    '雷',
    '钱',
    '汤',
    '尹',
    '黎',
    '易',
    '常',
    '武',
    '乔',
    '贺',
    '赖',
    '龚',
]
const lastName=[
    '子璇',
    '淼',
    '国栋',
    '夫子',
    '瑞堂',
    '甜',
    '尚',
    '国贤',
    '贺祥',
    '晨涛',
    '伟',
    '芳',
    '娜',
    '秀英',
    '敏',
    '静',
    '丽',
    '强',
    '磊',
    '军',
    '洋',
    '勇',
    '艳',
    '杰',
    '娟',
    '涛',
    '明',
    '超',
    '秀兰',
    '霞',
    '平',
    '刚',
    '桂英',
    '昊轩',
    '易轩',
    '益辰',
    '益帆',
    '益冉',
    '瑾春',
    '瑾昆',
    '春齐',
    '杨',
    '文昊',
    '东东',
    '雄霖',
    '浩晨',
    '熙涵',
    '溶溶',
    '冰枫',
    '欣欣',
    '宜豪',
    '欣慧',
    '建政',
    '美欣',
    '淑慧',
    '文轩',
    '文杰',
    '欣源',
    '忠林',
    '榕润',
    '欣汝',
    '慧嘉',
    '新建',
    '建林',
    '亦菲',
    '林',
    '冰洁',
    '佳欣',
    '涵涵',
    '禹辰',
    '淳美',
    '泽惠',
    '伟洋',
    '涵越',
    '润丽',
    '翔',
    '淑华',
    '晶莹',
    '凌晶',
    '苒溪',
    '雨涵',
    '嘉怡',
    '佳毅',
    '子辰',
    '佳琪',
    '紫轩',
    '瑞辰',
    '昕蕊',
    '萌',
    '明远',
    '欣宜',
    '泽远',
    '欣怡',
    '佳怡',
    '佳惠',
    '晨茜',
    '晨璐',
    '运昊',
    '汝鑫',
    '淑君',
    '晶滢',
    '润莎',
    '榕汕',
    '佳钰',
    '佳玉',
    '晓庆',
    '一鸣',
    '语晨',
    '添池',
    '添昊',
    '雨泽',
    '雅晗',
    '雅涵',
    '清妍',
    '诗悦',
    '嘉乐',
    '晨涵',
    '天赫',
    '玥傲',
    '佳昊',
    '天昊',
    '萌萌',
    '若萌',
]
return _sample(firstName) + _sample(lastName)
`

const 小区 = `
const prefix = ['天下', '世纪', '龙湖', '高兴', '万乐', '智慧']
const suffix = ['新村', '新花园', '小区', '广场', '中心', '家园', '新城']
return _sample(prefix) + _sample(suffix)
`

export default [
  {
    _id: 'var-lunyu',
    data: {
      name: '论语',
      code: 论语,
      explain: '随机返回一句论语',
    },
  },
  {
    _id: 'var-tuhua',
    data: {
      name: '土话',
      code: 土话,
      explain: '随机返回一句土话',
    },
  },
  {
    _id: 'var-xingzuo',
    data: {
      name: '星座',
      code: 星座,
      explain: '随机返回一个星座',
    },
  },
  {
    _id: 'var-shijiancuo',
    data: {
      name: '时间戳',
      code: 时间戳,
      explain: '随机返回一个13位时间戳',
    },
  },
  {
    _id: 'var-xingqi',
    data: {
      name: '星期',
      code: 星期,
      explain: '随机返回一个星期几，如星期一',
    },
  },
  {
    _id: 'var-rgbcolor',
    data: {
      name: 'rgb颜色',
      code: rgb颜色,
      explain: '随机生成一个 rgb 颜色',
    },
  },
  {
    _id: 'var-ipv4',
    data: {
      name: 'ipv4',
      code: ipv4,
      explain: '随机生成一个 ipv4 地址',
    },
  },
  {
    _id: 'var-ipv6',
    data: {
      name: 'ipv6',
      code: ipv6,
      explain: '随机生成一个 ipv6 地址',
    },
  },
  {
    _id: 'var-ip',
    data: {
      name: 'ip',
      code: ip,
      explain: '随机返回一个 ipv4 地址或 ipv6 地址',
    },
  },
  {
    _id: 'var-dianhuahaoma',
    data: {
      name: '电话号码',
      code: 电话号码,
      explain: '随机生成一个电话号码',
    },
  },
  {
    _id: 'var-xingming',
    data: {
      name: '姓名',
      code: 姓名,
      explain: '随机生成一个中文姓名',
    },
  },
  {
    _id: 'var-xiaoqu',
    data: {
      name: '小区',
      code: 小区,
      explain: '随机生成一个小区名称',
    },
  },
]
