<script setup lang="ts">
import Mdblock from '../Mdblock.vue'

const props = defineProps<{
  content: string
  link: string
}>()

const { content } = toRefs(props)
</script>

<template>
  <div class="flex flex-col gap-4">
    <Mdblock content="# Практика" />
    <div>
      <slot name="practice" />
      <div>
        <a :href="link">Ссылка на GitHub</a>
      </div>
    </div>

    <Mdblock content="# Конспект" />
    <Mdblock :content="content" />
  </div>
</template>
