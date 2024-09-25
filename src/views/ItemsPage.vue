<script setup lang="ts">
  import { onMounted, watch } from 'vue'
  import ItemCart from '@/components/ItemCart.vue'
  import { useRoute } from 'vue-router'
  import { usePageStore } from '@/stores/page'
  import { useSearchStore } from '@/stores/search'

  const route = useRoute()
  const store: any = usePageStore()
  const searchStore: any = useSearchStore()

  const isActive = (pageNum: string): boolean => {
    return route.name === `page${pageNum}`
  }

  onMounted(async () => {
    try {
      await store.initialize()
    } catch (error) {
      console.log('Error while onMounted', error)
    }
  })

  watch(
    () => route.path,
    async () => {
      try {
        await store.initialize()
      } catch (error) {
        console.error('Error while watch check update page', error)
      }
    },
    { deep: true },
  )
</script>
<template>
  <div class="content">
    <ItemCart
      v-for="item in store.page"
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
        v-if="store.currentPage !== 1 && store.currentPage !== null"
        :to="{
          name:
            store.currentPage !== null ? `page${store.currentPage - 1}` : '',
        }"
      >
        &#60;
      </router-link>
    </div>
    <router-link
      v-for="pageNum in store.pagesArray"
      :key="pageNum"
      :to="{ name: `page${pageNum}` }"
      :class="{
        'active-page': isActive(pageNum),
        'inactive-page': !isActive(pageNum),
      }"
    >
      {{ pageNum }}
    </router-link>
    <div class="button-nav">
      <router-link
        v-if="
          store.currentPage !== store.totalPages &&
          store.currentPage !== null &&
          store.totalPages !== null
        "
        :to="
          store.currentPage < store.totalPages
            ? { name: `page${store.currentPage + 1}` }
            : ''
        "
      >
        &#62;
      </router-link>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
  @import '../assets/mixin.scss';
  .content {
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
