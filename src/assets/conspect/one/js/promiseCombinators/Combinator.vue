<script setup lang="ts">
import type { LogMessageType } from '@/types/utils'
import { ElButton, ElOption, ElSelect } from 'element-plus'
import Logger from '@/components/utils/Logger.vue'
import { useLogger } from '@/utils'

const emit = defineEmits<{
  (
    e: 'clicked',
    clear: () => void,
    add: (type: LogMessageType, message: string) => void,
    shouldFail: 'all' | 'random' | 'no'
  ): void
}>()

const { logs, clear, add } = useLogger()

const shouldFail = ref<'all' | 'random' | 'no'>('random')
</script>

<template>
  <div class="flex flex-col gap-2">
    <ElButton
      type="primary"
      @click="emit('clicked', clear, add, shouldFail)"
    >
      Отправить запрос
    </ElButton>
    <div>
      Запросы могут падать?
    </div>
    <ElSelect v-model="shouldFail">
      <ElOption value="all" label="Все" />
      <ElOption value="random" label="Случайно" />
      <ElOption value="no" label="Нет" />
    </ElSelect>
    <Logger class="max-h-100" name="Результат" :logs="logs" />
  </div>
</template>
