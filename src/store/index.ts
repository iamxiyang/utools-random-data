import { utoolsDbSync } from './plugin'

const pinia = createPinia()
pinia.use(utoolsDbSync)

export default pinia

utools.onDbPull?.(() => {
  // 当此插件应用的数据在其他设备上被更改后同步到此设备时，uTools 将会主动调用这个方法
  console.log('onDbPull')
})
