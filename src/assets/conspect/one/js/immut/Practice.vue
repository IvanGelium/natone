<script setup lang="ts">
import { ElButton } from 'element-plus'

const currentArray = ref<number[]>([])
const history = ref<number[][]>([[]])
const pointer = ref(0)
function commit() {
  const newHistory = history.value.slice(0, pointer.value + 1)
  newHistory.push([...currentArray.value])
  if (newHistory.length > 11)
    newHistory.shift()

  history.value = newHistory
  pointer.value = history.value.length - 1
}

function add(times: number) {
  const newItems = Array.from<number>({ length: times }).fill(Math.ceil(Math.random() * 5))
  currentArray.value = [...currentArray.value, ...newItems]
  commit()
}

function subract(times: number) {
  currentArray.value = currentArray.value.slice(0, currentArray.value.length - times)
  commit()
}

function clean() {
  currentArray.value = []
  commit()
}

function undo() {
  if (pointer.value > 0) {
    pointer.value--
    currentArray.value = [...history.value[pointer.value]]
  }
}

function redo() {
  if (pointer.value < history.value.length - 1) {
    pointer.value++
    currentArray.value = [...history.value[pointer.value]]
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <div>
        Массив с возможностью отмены изменений.
      </div>
      <div>
        Цель: компонент который сохраняет n-состояний
        массива и позволяет вернуть его в прошлое состояние
      </div>
      <div>
        Результат:перед каждым изменением массива, мы сохраняем его текущее
        состояние в истории, а после создаем новый массив с обновленными данными.
        Это позволяет нам просматривать прошлые состояние массива меняя значение указателя.
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div class="font-bold">
        Визуальное представление массива
      </div>
      <div>
        <ElButton :disabled="currentArray.length > 18" type="primary" @click="add(2)">
          +2
        </ElButton>
        <ElButton :disabled="currentArray.length < 1" type="primary" @click="subract(2)">
          -2
        </ElButton>
        <ElButton :disabled="currentArray.length < 1" type="primary" @click="clean()">
          0
        </ElButton>
        <ElButton :disabled="pointer < 1" type="primary" @click="undo">
          {{ '<=' }}
        </ElButton>
        <ElButton :disabled="pointer === history.length - 1" type="primary" @click="redo">
          {{ '=>' }}
        </ElButton>
      </div>
      <div class="flex px-4 items-center gap-2 w-fit min-w-100 bg-primary-100 min-h-18 border-2 rounded-xl border-primary-400">
        <div v-if="currentArray.length" class="flex gap-2">
          <div v-for="(ar, index) in currentArray" :key="`arrarray-${index}`">
            <div class="flex border">
              <div v-for="n in ar" :key="`${n}-${index}-n`">
                <div class="border h-16 w-4 bg-primary-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
