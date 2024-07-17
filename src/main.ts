import './assets/main.css'

import { createApp } from 'vue'
import pinia from './stores'
import { createRoutes } from './router/index'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import VueSplide from '@splidejs/vue-splide'

async function initApp() {
  try {
    const app = createApp(App)
    app.use(pinia)
    const router = await createRoutes()
    if (router) {
      app.use(router)
    }
    app.use(autoAnimatePlugin)
    app.use(VueSplide)
    app.mount('#app')
  } catch (error) {
    console.error('Error while initializing app:', error)
  }
}
initApp()
