interface DbDoc<T = any> {
  data: T
  _id: string
  _rev?: string
}

interface Commands {
  code: string // 唯一标识,插件内不可重复
  explain: string // 描述,将在搜索列表对应位置中显示
  icon?: string // 图标,可选
  cmds: string[] // 功能响应词汇
  content: string // 功能内容，会被解析后返回使用
  feature?: boolean // 是否添加到直接唤醒，仅用于db中当做判断依据
}

type DbCommands = DbDoc<Commands>

interface Variables {
  code: string
  name: string
}


interface SystemVariablesObject {
  [key: string]: {
    fun: Function
    example: string | number
    description: string
  }
}

type DbVariables = DbDoc<Variables>

declare interface Window {
  preload?: typeof import('./preload/index');
}