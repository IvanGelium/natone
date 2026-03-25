<script setup lang="ts">
import Mdblock from '../Mdblock.vue'

const props = defineProps<{
  content: string
  link: string
  practice: boolean
}>()

const { content } = toRefs(props)
</script>

<template>
  <div class="flex flex-col gap-20">
    <div v-if="practice" class="flex flex-col gap-4">
      <Mdblock content="### Практика" />
      <div>
        <slot name="practice" />
        <div class="mt-2">
          <a :href="link">Ссылка на GitHub</a>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <Mdblock content="### Конспект" />
      <Mdblock :content="content" />
    </div>
    <div class="min-h-50" />
  </div>
</template>
