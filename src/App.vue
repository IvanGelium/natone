<script setup lang="ts">
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar/Sidebar.vue'
</script>

<template>
  <div class="p-2 bg-primary-100 flex flex-col gap-2 w-full h-screen">
    <Header />
    <main class="flex gap-2 flex-1 min-h-0">
      <Sidebar />
      <div class="flex-1 w-full h-full overflow-auto">
        <RouterView />
      </div>
    </main>
  </div>
</template>
