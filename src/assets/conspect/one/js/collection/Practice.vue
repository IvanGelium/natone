<script setup lang="ts">
import { ElButton } from 'element-plus'
import { useDebounce } from '@/utils'
import { fishtext } from './fishtext'

const currentText = ref('')
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col">
      <div>
        Анализатор текста, который демонстрирует основные подходы
        при обработке коллекций
      </div>
      <div>
        Цель: на примере работы с длинным текстом, показать как работают методы коллекций.
      </div>
      <div>
        Результат:
      </div>
    </div>
    <div class="flex gap-8">
      <div class="flex flex-col gap-2">
        <ElButton
          type="primary"
          @click="currentText = fishtext"
        >
          Подставить текст-рыбу
        </ElButton>
        <div class="font-bold">
          Окно для ввода текста
        </div>
        <div class="min-w-100 bg-primary-100">
          <el-input
            v-model="currentText"
            type="textarea"
            placeholder="Введите текст для анализа"
            :autosize="{ minRows: 10, maxRows: 15 }"
          />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <div class="font-bold">
          Анализ текста:
        </div>
        <div class="flex flex-col gap-2 min-w-100 min-h-100 bg-primary-100">
          <div>
            Общее количество слов:
          </div>
          <div>
            Количество уникальных слов:
          </div>
          <div>
            Топ самых частых слов:
          </div>
          <div>
            Процентное распределение по длине слов:
          </div>
          <div>
            Средняя длина слова:
          </div>
          <div>
            Средняя длина предложения:
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
