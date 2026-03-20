<script setup lang="ts">
import Buttons from './Buttons.vue'

const isSidebarOpen = ref(false)
</script>

<template>
  <div

    class="z-99 rounded-xl bg-secondary p-2 transition-all duration-200 h-full flex flex-col gap-2"
    :class="isSidebarOpen ? 'w-50' : 'w-16'"
  >
    <Buttons
      :is-side-bar-open="isSidebarOpen"
      @change-side-bar="isSidebarOpen = !isSidebarOpen"
    />
  </div>
  <!-- <div
    v-if="isSidebarOpen"
    class="z-99 bg-primary p-2 w-50 h-full flex flex-col gap-2"
  >
    <Buttons
      :is-side-bar-open="isSidebarOpen"
      @change-side-bar="isSidebarOpen = !isSidebarOpen"
    />
  </div> -->
</template>
