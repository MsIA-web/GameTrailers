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
  // console.log('CNR Start creating new routes...')
  try {
    const store = useSearchStore()
    // console.log('CNR Search store initialized.')
    let totalPages = await store.totalPages()
    // console.log('CNR Total pages fetched from store:', totalPages)
    totalPages = totalPages === 0 ? 1 : totalPages
    // console.log(
    //   'CNR Adjusted total pages (ensuring at least 1 page):',
    //   totalPages,
    // )
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      // console.log(`Adding route for page ${pageNum}...`)
      router.addRoute({
        path: `/search-page${pageNum}`,
        name: `search-page${pageNum}`,
        component: SearchResult,
        props: true,
      })
      // console.log(`CNR Route for page ${pageNum} added successfully.`)
    }
    await nextTick()
    routesReady = true
    store.routesReady = routesReady
    // console.log('CNR All routes created successfully.')
  } catch (error) {
    console.error('CNR Error while creating new routes:', error)
  }
}

export async function createSearchRoutes() {
  // console.log('CSR Start function createSearchRoutes')
  try {
    const store = useSearchStore()
    routesRemoved = false
    routesReady = false
    store.routesReady = routesReady
    await removeOldRoutes()
    await nextTick()
    // console.log('CSR Old routes removed, starting to create new routes')
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
    // console.log('CSR New routes created successfully')
  } catch (error) {
    console.error('Error while creating search routes:', error)
  }
}
