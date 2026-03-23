<script setup lang="ts">
import type { LogMessage, LogMessageType } from '@/types/utils'

const props = defineProps<
  {
    logs: LogMessage[]
    name?: string
  }
>()

const typeColor: Record<LogMessageType, string> = {
  start: 'text-blue-400',
  succeed: 'text-green-400',
  error: 'text-red-400',
}

const typeType: Record<LogMessageType, string> = {
  start: 'Старт',
  succeed: 'Успех',
  error: 'Ошибка',
}

const name = computed<string>(() => props.name || 'Логгер')
const containerRef = ref<HTMLElement | null>(null)
watch(
  () => props.logs,
  async () => {
    await nextTick()
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  },
  { deep: true },
)
</script>

<template>
  <div ref="containerRef" style="scroll-behavior: smooth" class=" bg-black p-4  rounded-xl flex flex-col gap-2 overflow-auto">
    <div class="text-white font-bold">
      {{ name }}: {{ logs.length ? '' : 'пусто' }}
    </div>
    <div class="flex flex-col">
      <div v-for="(log, index) in logs" :key="`log-${index}`">
        <div class="flex flex-col gap-2 font-mono">
          <div class="flex gap-2">
            <span
              :class="typeColor[log.type]"
            >
              {{ typeType[log.type] }}:
            </span>
            <span class="text-white">
              {{ log.message }}
            </span>
          </div>
          <div class="flex justify-between">
            <p class="text-[#8c8c8c] text-xs ">
              {{ index }}
            </p>
            <p class="text-white opacity-60 text-xs tabular-nums">
              {{ log.timestamp.toLocaleTimeString() }}
            </p>
          </div>
        </div>
        <hr class="border border-primary-900 w-full my-4">
      </div>
    </div>
  </div>
</template>
