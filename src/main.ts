import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRoutes } from './router/index'
import App from './App.vue'

async function initApp() {
  const app = createApp(App)
  const pinia = createPinia()
  app.use(pinia)

  const router = await createRoutes()
  if (router) {
    app.use(router)
  }
  app.mount('#app')
}
initApp()
