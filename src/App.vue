<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div id="wrapper">
    <AppHeader />
  </div>
</template>

<style lang="scss">
@media (min-width: 1441px) {
}
@media (max-width: 1024px) {
  #wrapper .size-32 {
    font-size: 28px;
  }
  #wrapper .size-22 {
    font-size: 18px;
  }
}
@media (max-width: 768px) {
  #wrapper .size-32 {
    font-size: 22px;
  }
  #wrapper .size-22 {
    font-size: 16px;
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
