<script setup lang="ts">
defineProps({
  id: Number,
  title: String,
  imgVertUrl: String,
  description: String,
})
</script>

<template>
  <div class="cart-item">
    <img class="poster-vert" :src="imgVertUrl" alt="image poster" />
    <div class="item-info">
      <span class="name size-22">{{ title }}</span>
      <p class="description size-20">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart-item {
  display: flex;
  gap: 4vw;
  padding: 5vh 5px 5vh 4vw;
  background-color: #ffffff1a;
  box-shadow:
    0px 4px 4px 0px rgba(0, 0, 0, 0.25),
    inset 0px 4px 4px 0px rgba(0, 0, 0, 0.08);
}
.poster-vert {
  object-fit: contain;
  width: 150px;
  height: 200px;
  cursor: pointer;
  align-self: center;
}
.item-info {
  color: white;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 5vh;
}
.name {
  margin-top: 20px;
  font-weight: bold;
  font-size: 22px;
  text-indent: 10px;
  cursor: pointer;
  word-break: keep-all;
  white-space: nowrap;
}
.description {
  text-indent: 10px;
  line-height: 1.2;
}
@media (min-width: 1441px) {
}
@media (max-width: 768px) {
  .poster-vert {
    width: 130px;
    height: 180px;
  }
}
@media (max-width: 480px) {
  .cart-item {
    flex-direction: column;
  }
  .name {
    margin: auto;
  }
}
</style>
