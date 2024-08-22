<script setup lang="ts">
  import ItemCart from '@/components/ItemCart.vue'
  import { onMounted, watch, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useSearchStore } from '@/stores/search'
  import { createSearchRoutes } from '@/router/index'

  const route = useRoute()

  const store: any = useSearchStore()

  const loading = ref<boolean>(true)

  const resultData = ref<boolean>(false)

  const searchResult = ref<Array<any>>([])

  const isActive = (pageNum: string): boolean => {
    return route.name === `search-page${pageNum}`
  }

  const changeUrlCurrentPage = (): void => {
    const path = route.path
    const pageNumber = parseInt(path.replace('/search-page', ''))
    store.currentPage = pageNumber
  }

  const searchResultDisplay = async (): Promise<void> => {
    searchResult.value = await store.paginatedItems()
    await store.totalPages()
    resultData.value = true
  }

  function waitForSearchResults(): Promise<void> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (resultData.value) {
          clearInterval(interval)
          resolve()
        }
      }, 300)
      setTimeout(() => {
        clearInterval(interval)
        reject(new Error('Timeout: search results took too long to load'))
      }, 10000)
    })
  }

  async function fetchSearchResults(): Promise<void> {
    loading.value = true
    resultData.value = false
    try {
      const dataProcessingPromise = searchResultDisplay()
      const waitForResultsPromise = waitForSearchResults()

      await dataProcessingPromise
      await waitForResultsPromise
    } catch (error) {
      console.error('Error fetching search results:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    try {
      await store.fetchTotalPages()
      changeUrlCurrentPage()
      await createSearchRoutes()
      await fetchSearchResults()
    } catch (error) {
      console.error('Error during onMounted:', error)
    }
  })

  watch(
    () => route.query.q,
    async () => {
      try {
        console.log('watch route query')
        if (route.query.q === '') {
          store.addSearchItems('')
          store.inputValue = ''
          loading.value = false
        }
        window.location.reload()
      } catch (error) {
        console.error('Error while watch check update page', error)
      }
    },
  )
  watch(
    () => route.path,
    async () => {
      try {
        console.log('watch route path')
        changeUrlCurrentPage()
        await searchResultDisplay()
      } catch (error) {
        console.error('Error while watch check update page', error)
      }
    },
  )
</script>

<template>
  <div v-if="loading" class="loading-spinner">Загрузка...</div>
  <div v-else>
    <div
      class="search-empty"
      v-if="!loading && (searchResult.length === 0 || route.query.q === '')"
    >
      <span class="fail-search">По вашему запросу ничего не найдено</span>
    </div>
    <div id="content" v-else>
      <div class="search-result">
        <ItemCart
          v-for="item in searchResult"
          :key="item.id"
          :id="item.id"
          :title="item.title"
          :imgVertUrl="item.imgVertUrl"
          :description="item.description"
        />
      </div>
      <nav class="navigation">
        <div class="button-nav">
          <router-link
            v-if="store.currentPage > 1"
            @click="store.reduceCurrentPage()"
            :to="{
              name: `search-page${store.currentPage - 1}`,
              query: { q: route.query.q },
            }"
          >
            &#60;
          </router-link>
        </div>
        <div
          class="page"
          v-if="store.pagesArray.length > 1 && store.routesReady"
        >
          <router-link
            v-for="pageNum in store.pagesArray"
            :key="pageNum"
            :to="{ name: `search-page${pageNum}`, query: { q: route.query.q } }"
            @click="store.setCurrentPage(pageNum)"
            :class="{
              'active-page': isActive(pageNum),
              'inactive-page': !isActive(pageNum),
            }"
          >
            {{ pageNum }}
          </router-link>
        </div>
        <div class="button-nav">
          <router-link
            v-if="
              store.currentPage < store.pagesArray.length && store.routesReady
            "
            @click="store.increaseCurrentPage()"
            :to="{
              name: `search-page${store.currentPage + 1}`,
              query: { q: route.query.q },
            }"
          >
            &#62;
          </router-link>
        </div>
      </nav>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '../assets/mixin.scss';

  .search-result {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .navigation {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  .button-nav {
    min-width: 20px;
    text-align: center;
    @include button-hover;
  }

  .page {
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  a {
    color: white;
    @include button-click;
  }

  .active-page {
    opacity: 1;
    @include button-hover;
  }

  .inactive-page {
    opacity: 0.6;
    @include button-hover;
  }
</style>
