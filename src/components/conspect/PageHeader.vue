<script setup lang="ts">
const props = defineProps<{
  header: string
  description: string
}>()

const { header, description } = toRefs(props)
</script>

<template>
  <header class="rounded-2xl border border-primary-200 bg-secondary px-6 py-5 shadow-sm flex gap-2 items-end">
    <div class="text-2xl font-semibold">
      {{ header }}:
    </div>
    <div class="h-full flex text-xl items-end">
      <p class="max-w-2xl text-secondary">
        {{ description }}
      </p>
    </div>
  </header>
</template>
