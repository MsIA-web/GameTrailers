import { createRouter, createWebHistory } from 'vue-router'
import ItemsPage from '../views/ItemsPage.vue'
import { getTotalPageCount } from '../services/EventServices'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/page1',
    },
    {
      path: '/page1',
      name: 'page1',
      component: ItemsPage,
    },
  ],
})

export async function createRoutes() {
  const totalPages = await getTotalPageCount()
  for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
    router.addRoute({
      path: `/page${pageNum}`,
      name: `page${pageNum}`,
      component: ItemsPage,
    })
  }

  return router
}
export default router
