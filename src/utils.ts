import type { Ref } from 'vue'
import type { FakeFetchConfig, LogMessage, LogMessageType } from '@/types/utils'
import { ref } from 'vue'

export function codeBlock(content: string): string {
  return `\`\`\`javascript${content}\`\`\`
  `
}

export function getDocUrl(path: string): string {
  const base = import.meta.env.VITE_GITHUB_REPO_URL
  return `${base}/${path}`
}

/**
 * Выполняет фейковый запрос к серверу.
 *
 * @param id - Уникальный идентификатор запроса.
 * @param config - Конфигурация запроса (необязательно).
 * @returns Промис с данными типа T.
 * @example const data = await fakeFetch(1, { delay: 1000 })
 */

export function fakeFetch<T = string>(
  id: number | string,
  config: FakeFetchConfig<T> = {},
): Promise<T> {
  const {
    delay = Math.floor(Math.random() * 5000),
    shouldFail = false,
    onLog,
    returnData = `Запрос ${id} завершен успешно.` as unknown as T,
  } = config

  onLog?.('start', `Запрос ${id} отправлен, задержка ${delay} мс`)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        onLog?.(
          'error',
          `Запрос ${id} упал.`,

        )
        reject(new Error(`Запрос ${id} упал.`))
      }
      else {
        onLog?.('succeed', `Запрос ${id} завершен успешно.`,
        )
        resolve(returnData)
      }
    }, delay)
  })
}

export function useLogger(): {
  logs: Ref<LogMessage[]>
  clear: () => void
  add: (type: LogMessageType, message: string) => void
} {
  const logs = ref<LogMessage[]>([])
  return {
    logs,
    clear: () => (logs.value = []),
    add(type: LogMessageType, message: string) {
      logs.value.push({
        type,
        message,
        timestamp: new Date(),
      })
    },
  }
}
