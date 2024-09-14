import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

//@ts-ignore
pinia.use(piniaPluginPersistedstate)

export default pinia
