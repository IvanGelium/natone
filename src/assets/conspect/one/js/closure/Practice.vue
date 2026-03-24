<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
import { ElInput } from 'element-plus'
import { useDebounce } from '@/utils'

const fieldRef = ref('')
const regex = /^\d*$/
const validation = ref<boolean>(true)
function onlyNumberValidation(string: string): void {
  validation.value = regex.test(string)
}

const { isDebouncing, debounced: debouncedValidation } = useDebounce(onlyNumberValidation, 500)
</script>

<template>
  <div class="max-w-1/2 flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div>
        Debounce-композабл
      </div>
      <div>
        Цель: композабал, который будет дебаунсить переданную в него функцию
      </div>
      <div>
        Результат: передаю функцию в композабл. Внутри используем таймер и сохраняем id.
        При каждом вызове функции, проверяем тикает ли текущий таймер, если да, очищаем его и вызываем новый.
        Когда таймер кончится, вызываем переданную функцию.
      </div>
    </div>
    <div class=" flex flex-col gap-4">
      <div class="flex gap-2 items-center">
        <span class="text-xl">
          Введите только цифры
        </span>
        <span>
          <Loading v-if="isDebouncing" class="animate-spin h-6" />
        </span>
      </div>

      <ElInput
        v-model="fieldRef"
        @input="debouncedValidation"
      />

      <p :class="validation ? '' : 'text-red-500'">
        {{ validation ? '' : 'Нужно ввести цифры!' }}
      </p>
    </div>
  </div>
</template>
