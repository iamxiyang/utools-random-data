import { createApp } from 'vue'
import { useDark } from '@vueuse/core'
import AppVue from './App.vue'
import pinia from './store'
import router from './router'
import { runCmd } from './commands/parse'
import { copyPasteOut, isDetach } from './utils/utools'

import 'uno.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-notification.css'
import './styles/index.scss'

// ==================== 常量 & 类型 ====================

const ROUTES = { COMMANDS: '/commands/', RANDOM_ALL: '/commands/random-all' } as const
const FEATURE_CODES = { SETTING: 'setting', RANDOM_ALL: 'random-all' } as const
const CMD_DB_PREFIX = 'cmd-'

interface PluginEnterParams { code: string; type: string; payload: unknown }
interface MainPushOption { text: string }

// ==================== 应用初始化 ====================

const app = createApp(AppVue).use(pinia).use(router)
let isAppMounted = false

const mountApp = () => {
  if (isAppMounted) return
  app.mount('#app')
  isAppMounted = true
  useDark({})
}

// ==================== 逻辑处理 ====================

/** 根据指令码获取对应的内容 */
const getCommandContent = (code: string): string | undefined => {
  if (!code) return

  // 1. 尝试直接获取
  const direct = utools.db.get(code) as any
  if (direct) return direct.data?.content ?? direct.content

  // 2. 全表扫描匹配 (处理 ID 不一致或同步延迟)
  const all = utools.db.allDocs()
  const target = all.find(item =>
    item._id === code ||
    item.data?.code === code ||
    (Array.isArray(item.data?.cmds || item.cmds) && (item.data?.cmds || item.cmds).includes(code))
  )

  return target?.data?.content ?? target?.content
}

/** 处理插件进入 */
const handlePluginEnter = async (action: any) => {
  const { code } = action
  await router.isReady()

  // 内置功能跳转
  if (code === FEATURE_CODES.SETTING || code === FEATURE_CODES.RANDOM_ALL) {
    mountApp()
    router.replace(code === FEATURE_CODES.SETTING ? ROUTES.COMMANDS : ROUTES.RANDOM_ALL)
    return
  }

  // 动态指令执行
  const content = getCommandContent(code)
  if (typeof content === 'string') {
    copyPasteOut(runCmd(content))
    if (isDetach()) {
      mountApp()
      router.replace(ROUTES.RANDOM_ALL)
    }
    return
  }

  // 失效清理
  if (code && !Object.values(FEATURE_CODES).includes(code as any)) {
    utools.showNotification('指令不存在或已失效')
    utools.removeFeature(code)
  }
}

// ==================== 主活动推送 ====================

utools.onMainPush?.(
  ({ code }) => {
    if (code !== FEATURE_CODES.RANDOM_ALL) return []
    return utools.db.allDocs(CMD_DB_PREFIX).map(row => ({ text: (row as any).data?.explain || '-' }))
  },
  ({ code, option }) => {
    if (code !== FEATURE_CODES.RANDOM_ALL) return
    const target = (utools.db.allDocs(CMD_DB_PREFIX) as any[]).find(row => row.data?.explain === option.text)
    if (target?.data?.content) copyPasteOut(runCmd(target.data.content))
  }
)

// ==================== 启动 ====================

const cachedEntry = (window as any)._utools_entry
if (cachedEntry) handlePluginEnter(cachedEntry)

utools.onPluginEnter(handlePluginEnter)