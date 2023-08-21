import { utoolsDbSync } from './plugin'

const pinia = createPinia()
pinia.use(utoolsDbSync)

export default pinia
