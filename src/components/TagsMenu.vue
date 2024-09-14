<script setup lang="ts">
  import { useSearchStore } from '@/stores/search'
  import { ref, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'

  const storeSearch: any = useSearchStore()

  const dropdownMenu = ref<any>(null)

  const localTagsMenu = ref<boolean>(false)

  const emit = defineEmits(['update:tagsMenu'])

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownMenu.value &&
      !dropdownMenu.value.contains(event.target as Node)
    ) {
      localTagsMenu.value = false
      emit('update:tagsMenu', localTagsMenu.value)
    }
  }

  onBeforeMount(async () => {
    await storeSearch.uniqueTags()
  })

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<template>
  <div id="tags-wrapper" ref="dropdownMenu">
    <div v-if="storeSearch.tags.length === 0" id="load-screen">
      <span>Идёт загрузка тэгов</span>
    </div>
    <ul v-else id="tags-menu">
      <li v-for="tag in storeSearch.tags" :key="tag.tag" class="size-16">
        <label>
          <input
            type="checkbox"
            v-model="tag.active"
            @change="storeSearch.addTag(tag.tag)"
          />
          {{ tag.tag }}
        </label>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  #tags-wrapper {
    padding: 5px;
    background-color: rgb(255, 255, 255);
    border-radius: 0.75rem;
  }
  #tags-menu {
    display: grid;
    grid-template-columns: repeat(4, minmax(120px, 1fr));
    gap: 5px;
  }
  @media (max-width: 1024px) {
    #tags-wrapper {
      top: 8.5rem;
    }
    #tags-menu {
      grid-template-columns: repeat(2, minmax(120px, 1fr));
    }
  }
  @media (max-width: 480px) {
    #tags-wrapper {
      max-width: 80vw;
      margin-right: 9vw;
    }
  }
</style>
