<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
import { ElInput } from 'element-plus'

const fieldRef = ref('')
const debouncing = ref(false)

function closureDebounce<T extends (...args: any[]) => any>(
  callback: T,
  time: number,
) {
  let timerId: number
  return function (this: unknown, ...args: Parameters<T>) {
    debouncing.value = true
    clearTimeout(timerId)
    timerId = setTimeout(() => callback.apply(this, args), time)
  }
}

const regex = /^\d*$/
const validation = ref<boolean>(true)
function onlyNumberValidation(string: string): void {
  validation.value = regex.test(string)
  debouncing.value = false
}

const debouncedValidation = closureDebounce(onlyNumberValidation, 500)
</script>

<template>
  <div class="max-w-1/2 flex flex-col gap-10">
    <div>
      <span class="text-xl">
        Debounce-функция
      </span>
      <span>
        - функция на основе closure которая позволяет не вызывать валидацию текста каждое нажатие
      </span>
    </div>
    <div class=" flex flex-col gap-4">
      <div class="flex gap-2 items-center">
        <span class="text-xl">
          Введите только цифры
        </span>
        <span>
          <Loading v-if="debouncing" class="animate-spin h-6" />
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
