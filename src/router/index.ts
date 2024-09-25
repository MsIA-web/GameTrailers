import { createRouter, createWebHistory } from 'vue-router'
import ItemsPage from '../views/ItemsPage.vue'
import { getTotalPageCount } from '../services/EventServices'
import ItemInfoPage from '@/views/ItemInfoPage.vue'
import SearchResult from '@/views/SearchResult.vue'
import { useSearchStore } from '@/stores/search'
import { nextTick } from 'vue'

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
      path: `/:title`,
      name: 'itemInfo',
      component: ItemInfoPage,
      props: true,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export async function createRoutes() {
  try {
    const totalPages = await getTotalPageCount()
    for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
      router.addRoute({
        path: `/page${pageNum}`,
        name: `page${pageNum}`,
        component: ItemsPage,
      })
    }

    return router
  } catch (error) {
    console.error('Error while creating routes:', error)
  }
}
let routesRemoved = false
let routesReady = false

async function removeOldRoutes() {
  const store = useSearchStore()
  await nextTick()

  return new Promise<void>((resolve) => {
    const existingRoutes = router.getRoutes()

    const maxPageNumber = store.pagesArray.length

    existingRoutes.forEach((route) => {
      if (
        typeof route.name === 'string' &&
        route.name.startsWith('search-page')
      ) {
        const pageNumber = parseInt(route.name.replace('search-page', ''))

        if (pageNumber > maxPageNumber) {
          router.removeRoute(route.name)
        }
      }
    })

    routesRemoved = true
    resolve()
  })
}

async function createNewRoutes() {
  try {
    const store = useSearchStore()
    let totalPages = await store.totalPages()
    totalPages = totalPages === 0 ? 1 : totalPages

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      router.addRoute({
        path: `/search-page${pageNum}`,
        name: `search-page${pageNum}`,
        component: SearchResult,
        props: true,
      })
    }
    await nextTick()
    routesReady = true
    store.routesReady = routesReady
  } catch (error) {
    console.error('CNR Error while creating new routes:', error)
  }
}

export async function createSearchRoutes() {
  try {
    const store = useSearchStore()
    routesRemoved = false
    routesReady = false
    store.routesReady = routesReady
    await removeOldRoutes()
    await nextTick()
    await new Promise<void>((resolve) => {
      const checkRoutesRemoved = setInterval(() => {
        if (routesRemoved) {
          clearInterval(checkRoutesRemoved)
          resolve()
        }
      }, 100)
    })
    await createNewRoutes()
    await nextTick()
  } catch (error) {
    console.error('Error while creating search routes:', error)
  }
}
