<script lang="ts" setup>
  import { mainOptions, thumbnailsOptions } from '@/utils/splideOptions'
  import { ref, onMounted, onBeforeMount } from 'vue'
  import { usePageStore } from '@/stores/page'

  const storePage: any = usePageStore()

  const images = ref<any[]>([])

  const mainSplideImages = ref<any>(null)
  const thumbnailSplideImages = ref<any>(null)

  onBeforeMount(() => {})

  onMounted(async () => {
    images.value = []
    storePage.extractMediaUrls(['imgUrl'], images.value)
    storePage.extractMediaUrls(['imgUrl'], images.value)
    if (
      mainSplideImages.value !== null &&
      thumbnailSplideImages.value !== null
    ) {
      const mainImages = mainSplideImages.value.splide
      const thumbnailsImages = thumbnailSplideImages.value.splide
      if (mainImages && thumbnailsImages) {
        mainImages.sync(thumbnailsImages)
      }
    }
  })
</script>

<template>
  <div class="gallery">
    <div id="normal-gallery">
      <Splide :options="mainOptions" ref="mainSplideImages" id="mainImage">
        <SplideSlide v-for="image in images" :key="image.id">
          <img :src="image.url" class="image main-image" />
        </SplideSlide>
      </Splide>
    </div>
    <div id="thumbnail-gallery">
      <Splide :options="thumbnailsOptions" ref="thumbnailSplideImages">
        <SplideSlide v-for="image in images" :key="image.id">
          <img :src="image.url" class="image" />
        </SplideSlide>
      </Splide>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '../assets/mixin.scss';
  @include splide-gallery;
  #thumbnail-gallery {
    margin-top: 20px;
  }
  .gallery {
    background-image: linear-gradient(90deg, #00000008 50%, #ffffff05);
    border-radius: 0.75rem;
    max-width: 70vw;
    padding: 20px 10px;
    align-self: center;
    width: 100%;
  }
  #thumbnail-gallery {
    margin-top: 20px;
  }
</style>
