<script lang="ts" setup>
  import { ref, onMounted } from 'vue'

  const props = defineProps<{
    trailer: { id: number; url: string }
    mainSplideTrailers: any
  }>()

  const player = ref<YT.Player | null>(null)

  const initializePlayers = () => {
    const iframes = document.querySelectorAll('#trailers iframe')

    const iframe = Array.from(iframes).find((iframe) => {
      const htmlIframe = iframe as HTMLIFrameElement
      return htmlIframe.src === `${props.trailer.url}&enablejsapi=1`
    })
    if (iframe) {
      try {
        player.value = new YT.Player(iframe as HTMLIFrameElement, {})
      } catch (error) {
        console.error('Ошибка при инициализации плеера:', error)
      }
    }
  }

  const stopVideo = () => {
    if (player.value && typeof player.value.pauseVideo === 'function') {
      player.value.pauseVideo()
    } else {
      console.warn('Player is not valid:', player)
    }
  }

  const loadYouTubeAPI = async (): Promise<void> => {
    return new Promise((resolve) => {
      //@ts-ignore
      window.onYouTubeIframeAPIReady = () => {
        resolve()
      }
    })
  }

  onMounted(async () => {
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
      await loadYouTubeAPI()
    }
    initializePlayers()

    if (props.mainSplideTrailers && props.mainSplideTrailers.splide) {
      const splideInstance = props.mainSplideTrailers.splide

      splideInstance.on('moved', () => {
        stopVideo()
      })
    }
  })
</script>

<template>
  <iframe
    class="normal"
    :src="`${props.trailer.url}&enablejsapi=1`"
    title="YouTube video player"
    allow="accelerometer; encrypted-media; gyroscope;"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
    modestbranding="1"
    iv_load_policy="3"
    rel="0"
  ></iframe>
</template>

<style lang="scss" scoped></style>
