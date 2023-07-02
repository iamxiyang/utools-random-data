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

import { debug } from './utils'
import { copyPasteOut } from './utils/utools'
import { runCmd } from './commands/parse'

const app = createApp(AppVue)
app.use(pinia)
app.use(router)
app.mount('#app')

utools.onPluginEnter(({ code, type, payload }) => {
  debug('用户进入插件main', code, type, payload)
  if (code === 'setting') {
    router.replace({ name: '/commands/' })
    return
  }
  if (code === 'random-all') {
    //  所有指令的列表，方便选择未添加到utools快捷启动的命令
    router.replace({ name: '/commands/random-all' })
    return
  }
  // 获取指令对应的配置内容，执行生成指令，然后退出插件
  const codeDb = utools.db.get(code)
  if (!codeDb) {
    router.replace({ name: '/commands/' })
    utools.showNotification('指令不存在')
    utools.removeFeature(code)
    return
  }
  const { content } = codeDb?.data
  const text = runCmd(content)
  copyPasteOut(text)
})

utools.onPluginOut(() => {
  debug('用户退出插件')
})

useDark({})
