<script setup lang="ts">
import { encodedTitle } from '../utils/utils'

const props = defineProps({
  id: Number,
  title: String,
  imgVertUrl: String,
})
</script>

<template>
  <router-link
    :to="{
      name: `itemInfo`,
      params: { title: encodedTitle(props) },
      query: { id },
    }"
  >
    <div class="search-item-cart">
      <img class="search-poster" :src="imgVertUrl" alt="image poster" />
      <span class="search-title size-20">{{ title }}</span>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.search-item-cart {
  width: 100%;
  padding: 5px;
  display: flex;
  align-items: center;
  gap: 1vw;
  cursor: pointer;
}
.search-poster {
  width: 6vw;
  height: 8vw;
  cursor: pointer;
  object-fit: contain;
  border-radius: 0.75rem;
}
.search-title {
  font-size: 20px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
}
</style>
