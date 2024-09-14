<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { usePageStore } from '@/stores/page'
  import { useSearchStore } from '@/stores/search'
  // import Splide from '@splidejs/splide'

  const route = useRoute()
  const store: any = usePageStore()
  const storeSearch: any = useSearchStore()

  const images = ref<any[]>([])
  const trailers = ref<any[]>([])
  const trailersPreview = ref<any>([])

  const mainSplideImages = ref<any>(null)
  const thumbnailSplideImages = ref<any>(null)

  const mainSplideTrailers = ref<any>(null)
  const thumbnailSplideTrailers = ref<any>(null)

  const isMobile = ref<boolean>(false)

  const updateIsMobile = () => {
    isMobile.value = window.innerWidth <= 480
  }

  const mainOptions = {
    width: '100%',
    height: '100%',
    type: 'fade',
    rewind: true,
    pagination: false,
    arrows: false,
    drag: false,
  }
  const mainOptionsForTrailers = {
    width: '100%',
    height: '100%',
    fixedHeight: '39.35vw',
    type: 'fade',
    rewind: true,
    pagination: false,
    arrows: false,
    drag: false,
  }
  const thumbnailsOptions = {
    fixedWidth: '20vw',
    fixedHeight: '100%',
    gap: 10,
    rewind: true,
    pagination: false,
    isNavigation: true,
    focus: 'center' as const,
    breakpoints: {
      768: {
        arrows: false,
      },
      480: {
        fixedWidth: '30vw',
      },
    },
  }

  const linking = () => {
    const win = window.open(store.currentItem.gameLink, '_blank')
    if (win) {
      win.opener = null
    } else {
      console.error('Не удалось открыть новое окно')
    }
  }

  const fetchData = async () => {
    try {
      const itemId = Number(route.query.id)
      store.getElementById(itemId)
      for (let key in store.currentItem.imgUrl) {
        let id = +key.replace('imgUrl', '')
        images.value.push({
          id: id,
          url: store.currentItem.imgUrl[key],
        })
      }
      for (let key in store.currentItem.trailerUrl) {
        let id = +key.replace('trailerUrl', '')
        trailers.value.push({
          id: id,
          url: store.currentItem.trailerUrl[key],
        })
      }
      for (let key in store.currentItem.trailerPreview) {
        let id = +key.replace('trailerPreview', '')
        trailersPreview.value.push({
          id: id,
          url: store.currentItem.trailerPreview[key],
        })
      }
      if (
        mainSplideImages.value !== null &&
        thumbnailSplideImages.value !== null &&
        mainSplideTrailers.value !== null &&
        thumbnailSplideTrailers.value !== null
      ) {
        const mainImages = mainSplideImages.value.splide
        const thumbnailsImages = thumbnailSplideImages.value.splide

        const mainTrailers = mainSplideTrailers.value.splide
        const thumbnailsTrailers = thumbnailSplideTrailers.value.splide
        if (
          mainImages &&
          thumbnailsImages &&
          mainTrailers &&
          thumbnailsTrailers
        ) {
          mainImages.sync(thumbnailsImages)
          mainTrailers.sync(thumbnailsTrailers)
        }
      }
      updateIsMobile()
    } catch (error) {
      console.error(error)
    }
    storeSearch.searchItems = []
  }
  const players = ref<YT.Player[]>([])

  const initializePlayers = () => {
    const iframes = document.querySelectorAll('#trailers iframe')
    players.value = Array.from(iframes).map((iframe) => {
      const player = new YT.Player(iframe as HTMLIFrameElement, {
        events: {
          onReady: onPlayerReady,
        },
      })
      return player
    })
  }

  const onPlayerReady = (event: YT.PlayerEvent) => {
    console.log('Player is ready', event)
  }

  const stopAndResetVideos = () => {
    players.value.forEach((player) => {
      player.pauseVideo() // Останавливаем видео
      player.seekTo(0, false) // Сбрасываем видео на начало
    })
  }

  onMounted(async () => {
    await fetchData()
    console.log(trailers.value)
    // if (!window.YT) {
    //   const script = document.createElement('script')
    //   script.src = 'https://www.youtube.com/iframe_api'
    //   document.body.appendChild(script)
    //   window.onYouTubeIframeAPIReady = initializePlayers
    // } else {
    //   initializePlayers()
    // }
    // mainSplideTrailers.value = new Splide(
    //   '#normal-trailers',
    //   mainOptionsForTrailers,
    // )
    // thumbnailSplideTrailers.value = new Splide(
    //   '#thumbnail-trailers',
    //   thumbnailsOptions,
    // )

    // mainSplideTrailers.value.on('move', () => {
    //   stopAndResetVideos()
    // })

    // thumbnailSplideTrailers.value.on('move', () => {
    //   stopAndResetVideos()
    // })

    // mainSplideTrailers.value.mount()
    // thumbnailSplideTrailers.value.mount()
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
          <span>{{ store.currentItem.devoloper }}</span>
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
    <div id="trailers">
      <div id="normal-trailers">
        <Splide :options="mainOptionsForTrailers" ref="mainSplideTrailers">
          <SplideSlide
            v-for="trailer in trailers"
            :key="trailer.id"
            id="trailer-block"
          >
            <iframe
              class="normal"
              :src="trailer.url"
              title="YouTube video player"
              allow="accelerometer; encrypted-media; gyroscope;"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              modestbranding="1"
              iv_load_policy="3"
              rel="0"
            ></iframe>
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
  .gallery {
    background-image: linear-gradient(90deg, #00000008 50%, #ffffff05);
    border-radius: 0.75rem;
    max-width: 70vw;
    padding: 20px 10px;
    align-self: center;
    width: 100%;
  }

  .splide__slide {
    opacity: 0.6;
  }

  .splide__slide.is-active {
    opacity: 1;
    border: none !important;
  }
  .splide__slide img {
    width: 100%;
    object-fit: cover;
  }

  .image {
    border-radius: 0.75rem;
  }
  #thumbnail-gallery {
    margin-top: 20px;
  }
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
  .thumbnail {
    border-radius: 0.75rem;
    width: 220px;
    height: 140px;
    object-fit: cover;
  }
  .trailer-link {
    margin-top: 150px;
  }
  .normal {
    width: 100%;
    height: 100%;
    border-radius: 0.75rem;
  }
  .splide {
    padding: 0;
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
