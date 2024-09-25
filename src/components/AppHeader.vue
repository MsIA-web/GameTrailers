<script setup lang="ts">
  import SearchInput from './SearchInput.vue'
  import TagsMenu from './TagsMenu.vue'
  import { onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useSearchStore } from '@/stores/search'

  const route = useRoute()

  const router = useRouter()

  const storeSearch: any = useSearchStore()

  const searchQuery = ref<string>('')

  const tagsMenu = ref<boolean>(false)

  const headerElement = ref<HTMLElement | null>(null)

  const headerHeight = ref<number>(headerElement.value?.offsetHeight || 0)

  const updateHeaderHeight = (): void => {
    headerHeight.value = headerElement.value?.offsetHeight || 0
  }
  const openTags = (): void => {
    tagsMenu.value = !tagsMenu.value
  }

  const handleButtonClick = (event: Event) => {
    event.stopPropagation()
    updateHeaderHeight()
    openTags()
  }

  const clearSearchStore = () => {
    storeSearch.searchItems = []
    storeSearch.inputValue = ''
    storeSearch.routesReady = false
    storeSearch.pagesArray = []
    storeSearch.currentPage = 1
  }

  const goHomePage = async (): Promise<void> => {
    clearSearchStore()
    router.push({ name: 'page1' })
  }

  onMounted(async () => {
    if (route.path.includes('search-page')) {
      searchQuery.value = storeSearch.inputValue
    }
    storeSearch.routesReady = false
    storeSearch.getData()
  })

  watch(route, () => {
    if (route.path.includes('search-page')) {
      searchQuery.value = storeSearch.inputValue
      if (route.query.q) {
        searchQuery.value = Array.isArray(route.query.q)
          ? (route.query.q[0] as string) || ''
          : (route.query.q as string) || ''
        storeSearch.addSearchItems(searchQuery.value)
      }
    } else {
      searchQuery.value = ''
    }
  })
</script>

<template>
  <div id="header" ref="headerElement">
    <div id="header-desktop">
      <span id="logo-name" class="size-32" @click="goHomePage"
        >GAME<br />TRAILERS</span
      >
      <SearchInput v-model:searchQuery="searchQuery" class="desktop-search" />
      <div id="tags">
        <button @click="handleButtonClick" id="tags-text" class="size-22">
          Фильтр
        </button>
        <button @click="handleButtonClick" id="tags-icon">
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 6H19M21 12H16M21 18H16M7 20V13.5612C7 13.3532 7 13.2492 6.97958 13.1497C6.96147 13.0615 6.93151 12.9761 6.89052 12.8958C6.84431 12.8054 6.77934 12.7242 6.64939 12.5617L3.35061 8.43826C3.22066 8.27583 3.15569 8.19461 3.10948 8.10417C3.06849 8.02393 3.03853 7.93852 3.02042 7.85026C3 7.75078 3 7.64677 3 7.43875V5.6C3 5.03995 3 4.75992 3.10899 4.54601C3.20487 4.35785 3.35785 4.20487 3.54601 4.10899C3.75992 4 4.03995 4 4.6 4H13.4C13.9601 4 14.2401 4 14.454 4.10899C14.6422 4.20487 14.7951 4.35785 14.891 4.54601C15 4.75992 15 5.03995 15 5.6V7.43875C15 7.64677 15 7.75078 14.9796 7.85026C14.9615 7.93852 14.9315 8.02393 14.8905 8.10417C14.8443 8.19461 14.7793 8.27583 14.6494 8.43826L11.3506 12.5617C11.2207 12.7242 11.1557 12.8054 11.1095 12.8958C11.0685 12.9761 11.0385 13.0615 11.0204 13.1497C11 13.2492 11 13.3532 11 13.5612V17L7 20Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <div
          id="tags-animate"
          v-auto-animate
          :style="{ top: headerHeight + 10 + 'px' }"
        >
          <TagsMenu v-if="tagsMenu" v-model:tagsMenu="tagsMenu" />
        </div>
      </div>
    </div>
    <div id="header-mobile">
      <SearchInput v-model:searchQuery="searchQuery" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '../assets/mixin.scss';
  #tags-animate {
    z-index: 77777;
    position: absolute;
    top: 6.5rem;
    right: 10px;
    max-width: 50vw;
    width: 100%;
    border-radius: 0.75rem;
  }
  @media (max-width: 480px) {
    #tags-animate {
      max-width: 90vw;
      right: 0;
    }
  }
  #header-desktop {
    padding: 20px 4vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  #logo-name {
    font-size: 32px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  #tags-text {
    display: inline-block;
    color: rgb(255, 255, 255);
    font-size: 22px;
    font-weight: 600;
    filter: brightness(0.8);
    cursor: pointer;
    @media (hover: hover) {
      &:hover {
        filter: brightness(1);
      }
    }
    &:active {
      filter: brightness(1);
    }
    @include button-click;
  }
  #tags-icon {
    display: none;
  }
  #header-mobile {
    display: none;
  }
  @media (max-width: 1024px) {
    .desktop-search {
      display: none;
    }
    #header-mobile {
      display: flex;
      justify-content: center;
      padding: 10px 0;
    }
  }
  @media (max-width: 480px) {
    #tags-text {
      display: none;
    }
    #tags-icon {
      display: inline-block;
      height: 25px;
      @include button-click;
      svg {
        margin-top: 2.5px;
      }
    }
  }
</style>
