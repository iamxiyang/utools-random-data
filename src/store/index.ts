import { defineStore } from 'pinia'

const defaultFeatures: DbFeature[] = [
  {
    _id: 'cmd-phone',
    data: {
      code: 'phone',
      explain: '随机生成手机号',
      cmds: ['手机号', '电话号码', 'phone'],
      content: '@{手机号}',
      feature: true,
    },
  },
  {
    _id: 'cmd-address',
    data: {
      code: 'address',
      explain: '随机生成国内地址',
      cmds: ['地址'],
      content: '@{地址}',
      feature: true,
    },
  },
  {
    _id: 'cmd-school',
    data: {
      code: 'school',
      explain: '随机生成院校名称',
      cmds: ['学校', '院校', '大学'],
      content: '@{学校}',
      feature: true,
    },
  },
  {
    _id: 'cmd-username',
    data: {
      code: 'username',
      explain: '随机生成姓名',
      cmds: ['姓名', '名字'],
      content: '@{姓名}',
      feature: true,
    },
  },
  {
    _id: 'cmd-idcard',
    data: {
      code: 'idcard',
      explain: '随机生成身份证号',
      cmds: ['身份证', 'idcard'],
      content: '@{身份证}',
      feature: true,
    },
  },
  {
    _id: 'cmd-text',
    data: {
      code: 'text',
      explain: '随机生成一大段废话填充数据',
      cmds: ['文本', '废话', 'text'],
      content: '@{长文本}',
      feature: true,
    },
  },
  {
    _id: 'cmd-email',
    data: {
      code: 'email',
      explain: '随机生成一个邮箱地址',
      cmds: ['邮箱', 'email'],
      content: '@{邮箱}',
      feature: true,
    },
  },
  {
    _id: 'cmd-quotes',
    data: {
      code: 'quotes',
      explain: '随机生成名人名言',
      cmds: ['名人名言', 'quotes'],
      content: '@{名言}',
      feature: true,
    },
  },
  {
    _id: 'cmd-domain',
    data: {
      code: 'domain',
      explain: '随机生成一个网页地址',
      cmds: ['网址', '域名', 'url', 'domain'],
      content: '@{网址}',
      feature: true,
    },
  },
  {
    _id: 'cmd-ip',
    data: {
      code: 'ip',
      explain: '随机生成一个ip地址',
      cmds: ['ip'],
      content: '@{ip}',
      feature: true,
    },
  },
]

export default defineStore('app', {
  state: () => {
    return {
      features: window.utools ? (utools.db.allDocs('cmd-') as DbFeature[]) : defaultFeatures,
    }
  },
  actions: {},
})

// if (bool) {
//   utools.setFeature({
//     code,
//     explain,
//     cmds: toRaw(cmds),
//     platform: ['win32', 'darwin', 'linux'],
//   })
// } else {
//   utools.removeFeature(code)
// }
// utools.db.put({
//   _id,
//   _rev,
//   data: {
//     setFeature: bool,
//     code,
//     explain,
//     cmds: toRaw(cmds),
//   },
// })