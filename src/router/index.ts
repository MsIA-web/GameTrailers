import { createRouter, createWebHistory } from 'vue-router'
import ItemsPage from '../views/ItemsPage.vue'
import { getTotalPageCount } from '../services/EventServices'
import ItemInfoPage from '@/views/ItemInfoPage.vue'

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
    {
      path: `/page1/:title`,
      name: 'page1ItemInfo',
      component: ItemInfoPage,
      props: true,
    },
  ],
})

export async function createRoutes() {
  try {
    const totalPages = await getTotalPageCount()
    for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
      router.addRoute({
        path: `/page${pageNum}`,
        name: `page${pageNum}`,
        component: ItemsPage,
      }),
        router.addRoute({
          path: `/page${pageNum}/:title`,
          name: `page${pageNum}ItemInfo`,
          component: ItemInfoPage,
          props: true,
        })
    }
    return router
  } catch (error) {
    console.error('Error while creating routes:', error)
  }
}
