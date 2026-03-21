<script setup lang="ts">
import { ElButton } from 'element-plus'

interface Log {
  time: number
  delta: string
  context: string
  content: string
  color: Context
}
type Context = 'sync' | 'micro' | 'macro'
type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'
const colorClassesRecord: Record<Context, string> = {
  sync: 'text-blue-400',
  micro: 'text-red-400',
  macro: 'text-yellow-400',
}

function formatDeltaTime(deltaMs: number): string {
  if (deltaMs === 0)
    return '0ms'

  if (deltaMs < 1000) {
    return `${Math.round(deltaMs)} ms`
  }

  const seconds = deltaMs / 1000
  if (seconds < 60) {
    return `${seconds.toFixed(3)} s`
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = (seconds % 60).toFixed(3)
  return `${minutes} m ${remainingSeconds} s`
}

const logs = ref<Log[]>([])

function createLog(context: Context, content: string): Log {
  const currentTime = performance.now()
  const lastTime = logs.value.at(-1)?.time || 0
  const delta = currentTime - lastTime

  return {
    time: currentTime,
    delta: formatDeltaTime(delta),
    context: `${context === 'sync'
      ? 'Стэк'
      : context === 'micro' ? 'Микроочередь' : 'Макроочередь'
    }: `,
    content,
    color: context,
  }
}

function addLog(log: Log) {
  logs.value = [...logs.value, log]
}

function getData(method: Method, url: string) {
  addLog(createLog('sync', 'Запускаем таймер'))
  setTimeout(() => {
    addLog(createLog('macro', 'Задача из макроочереди выполнилась'))
  }, 250)

  addLog(createLog('sync', 'Начали загрузку данных'))
  return fetch(url, { method })
}

async function handleClick() {
  addLog(createLog('sync', 'Первая синхронная строчка, делаем запрос данных'))
  addLog(createLog('sync', 'Сохранили промис'))
  try {
    const _data = await getData('GET', 'https://jsonplaceholder.typicode.com/posts/1')
    addLog(createLog('micro', 'Данные пришли, обрабатываем промис'))
  }
  catch {
    addLog(createLog('micro', 'Данные не удалось получить'))
  }
  finally {
    addLog(createLog('micro', 'Завершили обработку промиса'))
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div>
        Пример аналогичный Event loop, но с использованием Async/Await
      </div>
      <div>
        Цель: показать разницу в синтаксисе между работой с Promise и Async/Await
      </div>
      <div>
        Результат: добились аналогичного результата, но с более линейной записью
      </div>
    </div>
    <div class="flex flex-col gap-2 w-1/2">
      <ElButton
        type="primary"
        @click="() => {
          handleClick()
          addLog(createLog('sync', 'Последняя строчка синхронного кода'))
        }"
      >
        Сделать запрос
      </ElButton>
      <div class="bg-black p-4 rounded-xl flex flex-col gap-2 max-h-100 overflow-auto">
        <div class="text-green-400">
          Порядок выполнения операций:
        </div>
        <div v-for="(log, index) in logs" :key="`log-${index}`">
          <div>
            <div>
              <span :class="`${colorClassesRecord[log.color]}`">
                {{ log.context }}
              </span>
              <span class="text-white">
                {{ log.content }}
              </span>
            </div>
            <p class="text-green-500">
              ∆t: {{ log.delta }}
            </p>
            <hr class="mt-1 border border-y-green-500">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
