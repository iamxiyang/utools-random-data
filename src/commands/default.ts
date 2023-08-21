export default [
  {
    _id: 'cmd-phone',
    data: {
      code: 'cmd-phone',
      explain: '随机生成手机号',
      cmds: ['手机号', '电话号码', 'phone'],
      content: '${手机号}',
      feature: false,
    },
  },
  {
    _id: 'cmd-address',
    data: {
      code: 'cmd-address',
      explain: '随机生成国内地址',
      cmds: ['地址'],
      content: '${地址}',
      feature: false,
    },
  },
  {
    _id: 'cmd-username',
    data: {
      code: 'cmd-username',
      explain: '随机生成姓名',
      cmds: ['姓名', '名字'],
      content: '${姓名}',
      feature: false,
    },
  },
  {
    _id: 'cmd-email',
    data: {
      code: 'cmd-email',
      explain: '随机生成邮箱地址',
      cmds: ['邮箱', 'email'],
      content: '${邮箱}',
      feature: false,
    },
  },
]
