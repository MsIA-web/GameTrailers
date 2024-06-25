<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import ItemCart from '@/components/ItemCart.vue'
import { getData, getTotalPageCount } from '../services/EventServices'
import { useRoute } from 'vue-router'

const route = useRoute()
const items = ref<Array<any>>([])
const totalPageCount = ref<number | null>(null)
const pagesArray = ref<number[]>([])
const currentPage = ref<number | null>(null)

const extractPageNumberFromUrl = (): number | null => {
  const url = window.location.pathname
  const regex = /(\d+)$/
  const match = url.match(regex)
  if (match && match[1]) {
    return parseInt(match[1], 10)
  } else {
    return null
  }
}

const fetchTotalpageCount = async () => {
  totalPageCount.value = await getTotalPageCount()
  if (totalPageCount.value !== null) {
    pagesArray.value = Array.from(
      { length: totalPageCount.value },
      (_, k) => k + 1,
    )
  }
}

const fetchData = async () => {
  currentPage.value = extractPageNumberFromUrl()
  if (currentPage.value !== null) {
    items.value = await getData(currentPage.value)
  }
}

onMounted(async () => {
  fetchTotalpageCount()
  fetchData()
})

watch(
  route,
  () => {
    fetchData()
  },
  { deep: true },
)
</script>

<template>
  <div class="content">
    <ItemCart
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :imgVertUrl="item.imgVertUrl"
      :description="item.description"
    />
  </div>
  <nav class="navigation">
    <router-link
      v-if="currentPage !== 1"
      :to="{
        name: currentPage !== null ? `page${currentPage - 1}` : '',
      }"
    >
    &#60
    </router-link>
    <router-link
      v-for="page in pagesArray"
      :key="page"
      :to="{ name: `page${page}` }"
    >
      {{ page }}
    </router-link>
    <router-link
      v-if="currentPage !== totalPageCount"
      :to="{ name: currentPage !== null ? `page${currentPage + 1}` : '' }"
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
