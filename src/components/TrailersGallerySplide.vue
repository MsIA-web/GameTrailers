<script lang="ts" setup>
  import {
    thumbnailsOptions,
    mainOptionsForTrailers,
  } from '@/utils/splideOptions'
  import { ref, onMounted } from 'vue'

  import { usePageStore } from '@/stores/page'
  import YoutubeIframe from '@/components/YoutubeIframe.vue'

  const storePage: any = usePageStore()

  const trailers = ref<any[]>([])
  const trailersPreview = ref<any>([])

  const mainSplideTrailers = ref<any>(null)
  const thumbnailSplideTrailers = ref<any>(null)

  onMounted(async () => {
    trailers.value = []
    trailersPreview.value = []

    storePage.extractMediaUrls(['trailerUrl'], trailers.value)
    storePage.extractMediaUrls(['trailerPreview'], trailersPreview.value)
    if (
      mainSplideTrailers.value !== null &&
      thumbnailSplideTrailers.value !== null
    ) {
      const mainTrailers = mainSplideTrailers.value.splide
      const thumbnailsTrailers = thumbnailSplideTrailers.value.splide
      if (mainTrailers && thumbnailsTrailers) {
        mainTrailers.sync(thumbnailsTrailers)
      }
    }
  })
</script>

<template>
  <div id="trailers">
    <div id="normal-trailers">
      <Splide :options="mainOptionsForTrailers" ref="mainSplideTrailers">
        <SplideSlide
          v-for="trailer in trailers"
          :key="trailer.id"
          id="trailer-block"
        >
          <YoutubeIframe
            :trailer="trailer"
            :mainSplideTrailers="mainSplideTrailers"
          />
        </SplideSlide>
      </Splide>
    </div>
    <div id="thumbnail-trailers">
      <Splide :options="thumbnailsOptions" ref="thumbnailSplideTrailers">
        <SplideSlide v-for="preview in trailersPreview" :key="preview.id">
          <img class="image" :src="preview.url" alt="preview" />
        </SplideSlide>
      </Splide>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import '../assets/mixin.scss';
  @include splide-gallery;
  #trailers {
    background-image: linear-gradient(90deg, #00000008 50%, #ffffff05);
    border-radius: 0.75rem;
    width: 70vw;
    height: 100%;
    padding: 20px 10px;
    align-self: center;
    padding: 20px 10px;
    object-fit: cover;
    overflow: hidden;
  }

  #thumbnail-trailers {
    margin-top: 20px;
  }

  .trailer-link {
    margin-top: 150px;
  }
  .normal {
    width: 100%;
    height: 100%;
    border-radius: 0.75rem;
  }
</style>
