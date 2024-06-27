<script setup lang="ts">
import { onMounted, watch } from 'vue'
import ItemCart from '@/components/ItemCart.vue'
import { useRoute } from 'vue-router'
import { usePageStore } from '@/stores/page'

const route = useRoute()
const store = usePageStore()

onMounted(async () => {
  console.log('onMounted started')
  await store.initialize()
})

watch(
  () => route.path,
  async () => {
    console.log('watch started')
    await store.initialize()
  },
  { deep: true },
)
</script>

<template>
  <div class="content">
    <ItemCart
      v-for="item in store.page"
      :key="item.id"
      :title="item.title"
      :imgVertUrl="item.imgVertUrl"
      :description="item.description"
    />
  </div>
  <nav class="navigation">
    <router-link
      v-if="store.currentPage !== 1 && store.currentPage !== null"
      :to="{
        name: store.currentPage !== null ? `page${store.currentPage - 1}` : '',
      }"
    >
    &#60
    </router-link>
    <router-link
      v-for="pageNum in store.pagesArray"
      :key="pageNum"
      :to="{ name: `page${pageNum}` }"
      :class="{ active: store.currentPage === pageNum }"
    >
      {{ pageNum }}
    </router-link>
    <router-link
      v-if="store.currentPage !== store.totalPages && store.currentPage !== null && store.totalPages !== null"
      :to="store.currentPage < store.totalPages ? {name: `page${store.currentPage + 1}`} : ''"
    >
    &#62
    </router-link>
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
a {
  color: white;
  @include button-click;
}
</style>
