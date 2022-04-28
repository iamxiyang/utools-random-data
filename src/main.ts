import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { utoolsDbSync } from './store/plugin'
import { runCmd } from './utils/random'
import { initCmds } from './utils/init'
import { copyPasteOut } from './utils/utools'

const pinia = createPinia()
pinia.use(utoolsDbSync)

const app = createApp(App)
app.use(pinia)
app.use(router)

const mountApp = () => {
  app.mount('#app')
}

if (window.utools) {
  utools.onPluginReady(() => {
    // 初始化数据
    initCmds()
  })

  utools.onPluginEnter(({ code, type, payload }) => {
    console.log('用户进入插件', code, type, payload)
    if (code === 'setting') {
      mountApp()
      router.replace({ name: 'index' })
      return
    }
    if (code === 'random-all') {
      //  所有指令的列表，方便选择未添加到utools快捷启动的命令
      mountApp()
      router.replace({ name: 'random-all' })
      return
    }
    // 获取指令对应的配置内容，执行生成指令，然后退出插件
    const dbData = utools.db.get(code)
    if (dbData) {
      const { data } = dbData
      const text = runCmd(data.content)
      copyPasteOut(text)
      return
    } else {
      mountApp()
      router.replace({ name: 'index' })
      utools.showNotification('指令不存在')
      utools.removeFeature(code)
    }
  })

  utools.onPluginOut(() => {
    console.log('用户退出插件')
    app.unmount()
  })

  // utools.onPluginDetach(() => {
  //   alert('分离窗口时自动粘贴可能存在问题，请手动粘贴')
  //   console.log('插件被分离')
  // })
} else {
  mountApp()
  console.error('目前不在 utools 环境，仅限调试使用，保存的数据刷新后会被重置')
}
