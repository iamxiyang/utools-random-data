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

  // 获取指令对应的配置内容
  const codeDb = utools.db.get(code)
  if (!codeDb) {
    mountApp()
    router.replace(ROUTES.COMMANDS)
    utools.showNotification('指令不存在或已失效')
    utools.removeFeature(code)
    return
  }

  // 执行生成指令
  const { content } = codeDb?.data || {}
  if (!content) {
    mountApp()
    router.replace(ROUTES.COMMANDS)
    return
  }

  const text = runCmd(content)
  copyPasteOut(text)

  if (isDetach()) {
    mountApp()
    router.replace(ROUTES.RANDOM_ALL)
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