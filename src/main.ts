import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import { utoolsDbSync } from './store/plugin'

const pinia = createPinia()
pinia.use(utoolsDbSync)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
