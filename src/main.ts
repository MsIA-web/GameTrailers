import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRoutes } from './router/index'

import App from './App.vue'
import router from './router'

async function initApp() {
  const router = await createRoutes()

  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  app.mount('#app')
}

initApp()
