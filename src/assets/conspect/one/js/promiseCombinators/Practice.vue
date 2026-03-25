<script setup lang="ts">
import type { LogMessageType } from '@/types/utils'
import { fakeFetch } from '@/utils'
import Combinator from './Combinator.vue'

type FailType = 'all' | 'random' | 'no'
async function handleClickAll(
  clear: () => void,
  add: (type: LogMessageType, message: string) => void,
  shouldFail: FailType,
) {
  clear()
  add('start', 'Запуск Promise.all')

  const fetches = [1, 2, 3, 4]

  const promises = fetches.map((id) => {
    return fakeFetch(id, {

      shouldFail: shouldFail === 'all'
        ? true
        : shouldFail === 'no'
          ? false
          : Math.random() > 0.5,
      onLog: add,
    })
  })

  try {
    await Promise.all(promises)
    add('succeed', 'Комбинатор Promise.all успех')
  }
  catch {
    add('error', `Комбинатор Promise.all упал`)
  }
}

async function handleClickAllSettled(
  clear: () => void,
  add: (type: LogMessageType, message: string) => void,
  shouldFail: FailType,
) {
  clear()
  add('start', 'Запуск Promise.all')

  const fetches = [1, 2, 3, 4]

  const promises = fetches.map((id) => {
    return fakeFetch(id, {

      shouldFail: shouldFail === 'all'
        ? true
        : shouldFail === 'no'
          ? false
          : Math.random() > 0.5,
      onLog: add,
    })
  })

  try {
    await Promise.allSettled(promises)
    add('succeed', 'Комбинатор Promise.allSettled успех')
  }
  catch {
    add('error', `Комбинатор Promise.allSettled упал`)
  }
}
async function handleClickRace(
  clear: () => void,
  add: (type: LogMessageType, message: string) => void,
  shouldFail: FailType,
) {
  clear()
  add('start', 'Запуск Promise.all')

  const fetches = [1, 2, 3, 4]

  const promises = fetches.map((id) => {
    return fakeFetch(id, {

      shouldFail: shouldFail === 'all'
        ? true
        : shouldFail === 'no'
          ? false
          : Math.random() > 0.5,
      onLog: add,
    })
  })

  try {
    await Promise.race(promises)
    add('succeed', 'Комбинатор Promise.race успех')
  }
  catch {
    add('error', `Комбинатор Promise.race упал`)
  }
}
async function handleClickAny(
  clear: () => void,
  add: (type: LogMessageType, message: string) => void,
  shouldFail: FailType,
) {
  clear()
  add('start', 'Запуск Promise.all')

  const fetches = [1, 2, 3, 4]

  const promises = fetches.map((id) => {
    return fakeFetch(id, {

      shouldFail: shouldFail === 'all'
        ? true
        : shouldFail === 'no'
          ? false
          : Math.random() > 0.5,
      onLog: add,
    })
  })

  try {
    await Promise.any(promises)
    add('succeed', 'Комбинатор Promise.any успех')
  }
  catch {
    add('error', `Комбинатор Promise.any упал`)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div>
        Демонстрация работы promise combinators с помощью фейковых запросов
      </div>
      <div>
        Цель: продемонстрировать работу разных комбинаторов
      </div>
      <div>
        Результат:
      </div>
    </div>
    <div class="flex gap-8 w-full">
      <div class="flex flex-col gap-2 w-full">
        <p class="font-bold">
          Демо Promise.all
        </p>
        <Combinator @clicked="(add, clear, shouldFail) => handleClickAll(add, clear, shouldFail)" />
      </div>
      <div class="flex flex-col gap-2 w-full">
        <p class="font-bold">
          Демо Promise.allSettled
        </p>
        <Combinator @clicked="handleClickAllSettled" />
      </div>
      <div class="flex flex-col gap-2 w-full">
        <p class="font-bold">
          Демо Promise.race
        </p>
        <Combinator @clicked="handleClickRace" />
      </div>
      <div class="flex flex-col gap-2 w-full">
        <p class="font-bold">
          Демо Promise.any
        </p>
        <Combinator @clicked="handleClickAny" />
      </div>
    </div>
  </div>
</template>
