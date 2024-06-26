import { createApp } from 'vue'
import { useDark } from '@vueuse/core'

import AppVue from './App.vue'
import pinia from './store'
import router from './router'

import 'uno.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-dialog.css'
import 'element-plus/theme-chalk/el-notification.css'

import { debug } from './utils'
import { runCmd } from './commands/parse'
import { copyPasteOut, isDetach } from './utils/utools'

const app = createApp(AppVue)
app.use(pinia)
app.use(router)

utools.onPluginEnter(({ code, type, payload }) => {
  debug('用户进入插件main', code, type, payload)
  if (code === 'setting') {
    router.push({ name: '/commands/' })
    return
  }
  if (code === 'random-all') {
    // 所有指令的列表，方便选择未添加到utools快捷启动的命令
    router.push({ name: '/commands/random-all' })
    return
  }
  // 获取指令对应的配置内容，执行生成指令，然后退出插件
  const codeDb = utools.db.get(code)
  if (!codeDb) {
    router.push({ name: '/commands/' })
    utools.showNotification('指令不存在')
    utools.removeFeature(code)
    return
  }
  const { content } = codeDb?.data
  const text = runCmd(content)
  copyPasteOut(text)
  if (isDetach()) {
    router.push({ name: '/commands/random-all' })
  }
})

const dbCommands = utools.db.allDocs('cmd-')
utools.onMainPush?.(
  // callback
  ({ code }) => {
    if (code === 'random-all') {
      return dbCommands.map((row) => {
        const explain = row?.data?.explain
        return {
          text: explain || '-',
        }
      })
    }
    return []
  },
  // selectCallback
  ({ code, option }) => {
    if (code === 'random-all') {
      // 根据名称查询所有数据，找到匹配的
      const dbCommand = dbCommands.find((row) => {
        const { explain } = row.data
        return explain === option.text
      })
      if (!dbCommand) {
        return true
      }
      const content = dbCommand.data.content

      if (!content) {
        return true
      }
      const text = runCmd(content)
      copyPasteOut(text)
    }
  },
)

app.mount('#app')
useDark({})
