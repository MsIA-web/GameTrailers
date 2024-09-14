<script setup lang="ts">
  import SearchItemCart from '@/components/SearchItemCart.vue'
  import { ref, nextTick, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSearchStore } from '@/stores/search'

  const router = useRouter()

  const storeSearch: any = useSearchStore()

  const searchState = ref<boolean>(false)

  const searchInput = ref<any>(null)

  const searchButton = ref<any>(null)

  const props = defineProps({
    searchQuery: String,
  })

  const emit = defineEmits(['update:searchQuery'])

  const localSearchQuery = ref(props.searchQuery)

  const clickSearch = () => {
    searchState.value = true
    console.log('click search')
    const blur = () => {
      setTimeout(() => (searchState.value = false), 100)
      searchInput.value.removeEventListener('blur', blur)
    }
    searchInput.value.addEventListener('blur', blur)
    storeSearch.searchItems = storeSearch.filterData
  }

  const handleInput = (event: any) => {
    localSearchQuery.value = event.target.value
    const inputValue = event.target.value
    storeSearch.addSearchItems(inputValue)
  }

  const triggerButtonClick = async () => {
    await nextTick()
    await navigateToSearch()
    searchState.value = false
    searchInput.value.blur()
  }

  const navigateToSearch = async (event?: Event): Promise<void> => {
    try {
      if (event) {
        event.stopPropagation()
      }
      storeSearch.searchItems = storeSearch.filterData
      await nextTick()
      router.push({
        name: 'search-page1',
        query: { q: localSearchQuery.value, tags: storeSearch.chekedTags },
      })
    } catch (error) {
      console.error('Navigation error:', error)
    } finally {
      searchState.value = false
    }
  }
  watch(localSearchQuery, (newVal) => {
    emit('update:searchQuery', newVal)
  })

  watch(
    () => props.searchQuery,
    (newVal) => {
      localSearchQuery.value = newVal
    },
  )
</script>

<template>
  <div id="search-layout">
    <div id="search" @click="clickSearch">
      <input
        ref="searchInput"
        type="text"
        class="size-16"
        placeholder="Поиск.."
        id="search-input"
        @input="handleInput"
        v-model="localSearchQuery"
        @keyup.enter="triggerButtonClick"
      />
      <button id="search-icon" ref="searchButton" @click="navigateToSearch">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 29 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.1111 6.16667C16.9464 6.16667 20.0556 9.27581 20.0556 13.1111M20.9706 20.9651L27 27M24.2222 13.1111C24.2222 19.2476 19.2476 24.2222 13.1111 24.2222C6.97461 24.2222 2 19.2476 2 13.1111C2 6.97461 6.97461 2 13.1111 2C19.2476 2 24.2222 6.97461 24.2222 13.1111Z"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
    <div
      id="search-result-wrapper"
      :class="{
        'has-outline':
          localSearchQuery !== '' && storeSearch.searchItems.length !== 0,
        'no-outline':
          localSearchQuery === '' || storeSearch.searchItems.length == 0,
      }"
      v-if="searchState"
    >
      <div id="search-result" v-auto-animate>
        <SearchItemCart
          v-for="item in storeSearch.searchItems"
          :key="item.id"
          :id="item.id"
          :title="item.title"
          :imgVertUrl="item.imgVertUrl"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '../assets/mixin.scss';

  #search-layout {
    max-width: 50vw;
    width: 100%;
  }
  #search {
    max-width: 50vw;
    width: 100%;
    height: 40px;
    position: relative;
  }
  #search-input {
    height: 100%;
    width: 100%;
    padding: 5px;
    &:focus {
      outline: 2px solid black;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  #search-icon {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 15px;
    top: 4.5px;
    cursor: pointer;
    color: #e89191;
    @media (hover: hover) {
      &:hover {
        color: #f95555;
      }
    }
    @include button-click;
  }

  #search-result-wrapper {
    max-width: 50vw;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    position: absolute;
    z-index: 1;
    &.has-outline {
      outline: 2px solid black;
    }

    &.no-outline {
      outline: none;
    }
  }
  #search-result {
    max-height: 20vw;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 1024px) {
    #search-layout {
      max-width: 90vw;
    }
    #search {
      max-width: 90vw;
    }
    #search-result-wrapper {
      max-width: 90vw;
    }
    #search-result {
      max-height: 20vw;
    }
  }
  @media (max-width: 768px) {
    #search {
      height: 30px;
    }
    #search-input:focus + #search-icon {
      color: #f95555;
    }

    #search-icon {
      width: 25px;
      height: 25px;
      top: 3px;
    }
    #search-result {
      max-height: 40vw;
    }
  }
  @media (max-width: 480px) {
    #search {
      height: 30px;
    }
    #search-icon {
      width: 20px;
      height: 20px;
      top: 2.5px;
    }
    #search-result {
      max-height: 60vw;
    }
  }
</style>
