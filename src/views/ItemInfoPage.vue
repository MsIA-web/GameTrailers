<script lang="ts" setup>
  import { onMounted, ref, watch, onBeforeMount } from 'vue'
  import { useRoute } from 'vue-router'
  import { usePageStore } from '@/stores/page'
  import { useSearchStore } from '@/stores/search'
  import PhotoGallerySplide from '@/components/PhotoGallerySplide.vue'
  import TrailersGallerySplide from '@/components/TrailersGallerySplide.vue'

  const route = useRoute()
  const store: any = usePageStore()
  const storeSearch: any = useSearchStore()

  const itemId = ref<number>(0)

  const isMobile = ref<boolean>(false)

  const updateIsMobile = () => {
    isMobile.value = window.innerWidth <= 480
  }

  const linking = () => {
    const win = window.open(store.currentItem.gameLink, '_blank')
    if (win) {
      win.opener = null
    } else {
      console.error('Не удалось открыть новое окно')
    }
  }

  onBeforeMount(() => {
    itemId.value = Number(route.query.id)
    store.getElementById(itemId.value)
  })
  onMounted(async () => {
    updateIsMobile()
    storeSearch.searchItems = []
  })

  watch(
    route,
    () => {
      updateIsMobile()
      storeSearch.searchItems = []
    },
    { deep: true },
  )
</script>

<template>
  <div class="gamePage" v-if="store.currentItem">
    <img
      class="landImg"
      :src="store.currentItem.imgLandUrl"
      alt="Land scape image"
    />
    <span class="name size-32">{{ store.currentItem.title }}</span>
    <div class="info size-16">
      <ul class="info-product">
        <li class="product">
          <span v-if="!isMobile">Дата выхода:</span>
          <span v-if="isMobile">Дата выхода</span>

          <span>{{ store.currentItem.releaseDate }}</span>
        </li>
        <li class="product">
          <span v-if="!isMobile">Разработчик:</span>
          <span v-if="isMobile">Разработчик</span>
          <span>{{ store.currentItem.developer }}</span>
        </li>
        <li class="product">
          <span v-if="!isMobile"> Издатель:</span>
          <span v-if="isMobile"> Издатель</span
          ><span>{{ store.currentItem.publisher }}</span>
        </li>
      </ul>
      <ul class="info-tags">
        <li
          class="tag"
          v-for="(tag, index) in store.currentItem.tags"
          :key="index"
        >
          {{ tag }}
        </li>
      </ul>
    </div>
    <PhotoGallerySplide />

    <TrailersGallerySplide />
    <div id="gameLink">
      <img
        @click="linking()"
        id="link"
        :src="store.currentItem.gameIcon"
        alt="Game Link"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '../assets/mixin.scss';

  .gamePage {
    padding: 20px 4vw;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: white;
  }
  .landImg {
    border-radius: 0.75rem;
  }
  .name {
    font-size: 32px;
    font-weight: bold;
    align-self: center;
  }
  .info {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
  .info-product {
    display: flex;
    gap: 10px;
  }
  .product {
    display: flex;
    gap: 1vw;
  }
  .info-tags {
    display: flex;
    gap: 10px;
  }
  #gameLink {
    align-self: center;
    width: 70vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  #link {
    cursor: pointer;
    transition: 0.3s ease;
    width: 32px;
    height: 32px;
    @media (hover: hover) {
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  @media (max-width: 480px) {
    .product {
      flex-direction: column;
      align-items: center;
      gap: 3vw;
    }
  }
</style>
