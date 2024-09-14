<script setup lang="ts">
  import AppHeader from './components/AppHeader.vue'
  import AppContent from './components/AppContent.vue'
  import AppFooter from './components/AppFooter.vue'
  import { onBeforeMount } from 'vue'
  import { useSearchStore } from '@/stores/search'

  const searchStore = useSearchStore()

  onBeforeMount(async () => {
    await searchStore.getData()
  })
</script>

<template>
  <div id="wrapper">
    <AppHeader />
    <AppContent />
    <AppFooter />
  </div>
</template>

<style lang="scss">
  #wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  @media (min-width: 1441px) {
  }
  @media (max-width: 1024px) {
    #wrapper .size-32 {
      font-size: 28px;
    }
    #wrapper .size-22 {
      font-size: 18px;
    }
    #wrapper .size-20 {
      font-size: 16px;
    }
  }
  @media (max-width: 768px) {
    #wrapper .size-32 {
      font-size: 22px;
    }
    #wrapper .size-22 {
      font-size: 16px;
    }
    #wrapper .size-20 {
      font-size: 14px;
    }
    #wrapper .size-16 {
      font-size: 14px;
    }
  }
  @media (max-width: 480px) {
    #wrapper .size-32 {
      font-size: 18px;
    }
  }
</style>
