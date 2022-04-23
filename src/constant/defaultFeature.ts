export default [
  {
    _id: 'cmd-phone',
    data: {
      code: 'cmd-phone',
      explain: '随机生成手机号',
      cmds: ['手机号', '电话号码', 'phone'],
      content: '${手机号}',
      feature: true,
    },
  },
  {
    _id: 'cmd-address',
    data: {
      code: 'cmd-address',
      explain: '随机生成国内地址',
      cmds: ['地址'],
      content: '${地址}',
      feature: true,
    },
  },
  {
    _id: 'cmd-school',
    data: {
      code: 'cmd-school',
      explain: '随机生成院校名称',
      cmds: ['学校', '院校', '大学'],
      content: '${学校}',
      feature: true,
    },
  },
  {
    _id: 'cmd-username',
    data: {
      code: 'cmd-username',
      explain: '随机生成姓名',
      cmds: ['姓名', '名字'],
      content: '${姓名}',
      feature: true,
    },
  },
  {
    _id: 'cmd-idcard',
    data: {
      code: 'cmd-idcard',
      explain: '随机生成身份证号',
      cmds: ['身份证', 'idcard'],
      content: '${身份证号}',
      feature: true,
    },
  },
  {
    _id: 'cmd-text',
    data: {
      code: 'cmd-text',
      explain: '随机生成一大段废话填充数据',
      cmds: ['文本', '废话', 'text'],
      content: '${文本}',
      feature: true,
    },
  },
  {
    _id: 'cmd-email',
    data: {
      code: 'cmd-email',
      explain: '随机生成一个邮箱地址',
      cmds: ['邮箱', 'email'],
      content: '${邮箱}',
      feature: true,
    },
  },
  {
    _id: 'cmd-quotes',
    data: {
      code: 'cmd-quotes',
      explain: '随机生成名人名言',
      cmds: ['名人名言', 'quotes'],
      content: '${论语}',
      feature: true,
    },
  },
  {
    _id: 'cmd-domain',
    data: {
      code: 'cmd-domain',
      explain: '随机生成一个网页地址',
      cmds: ['网址', '域名', 'url', 'domain'],
      content: '${网址}',
      feature: true,
    },
  },
  {
    _id: 'cmd-ip',
    data: {
      code: 'cmd-ip',
      explain: '随机生成一个ip地址',
      cmds: ['ip', 'ipv4'],
      content: '${ipv4}',
      feature: true,
    },
  },
]
