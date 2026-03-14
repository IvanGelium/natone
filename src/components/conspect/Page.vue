<script setup lang="ts">
import Mdblock from '../Mdblock.vue'

const props = defineProps<{
  content: string
}>()

const { content } = toRefs(props)
</script>

<template>
  <div class="flex flex-col gap-4">
    <Mdblock content="# Конспект" />
    <Mdblock :content="content" />
    <Mdblock content="# Практика" />
    <slot name="practice" />
  </div>
</template>
