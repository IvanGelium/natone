import type { Ref } from 'vue'
import type { FakeFetchConfig, LogMessage, LogMessageType } from '@/types/utils'
import { onUnmounted, ref } from 'vue'

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

// Насколько хук может быть сложным, это же просто дебаунс
// Дебаунс:

/**
 * Vue-composable для создания дебаунс-функции с поддержкой Promise и реактивным состоянием.
 *
 * @param callback - Асинхронная или синхронная функция, которую нужно выполнить.
 * @param delay - Задержка в миллисекундах.
 * @param config - Объект настроек:
 *   - `immediate`: если true, первый вызов в серии выполнится мгновенно.
 *
 * @returns Объект со следующими полями:
 * - `debounced`: основная функция, возвращающая Promise с результатом выполнения.
 * - `isDebouncing`: реактивный флаг (Ref), указывающий, идет ли сейчас ожидание.
 * - `cancel`: метод для отмены текущего таймера и отклонения (reject) ожидающего промиса.
 * - `flush`: метод для немедленного выполнения запланированного действия.
 *
 * @example
 * const { debounced: search, isDebouncing } = useDebounce(fetchData, 500);
 * // Можно использовать await:
 * const result = await search('query');
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  config?: { immediate?: boolean },
) {
  let timerId: ReturnType<typeof setTimeout> | undefined
  let activePromise: Promise<ReturnType<T>> | null = null
  let resolvePromise: ((val: ReturnType<T>) => void) | null = null
  let rejectPromise: ((reason: any) => void) | null = null
  let savedArgs: Parameters<T> | null = null

  const isDebouncing = ref(false)

  const cleanup = () => {
    if (timerId)
      clearTimeout(timerId)
    timerId = undefined
    activePromise = null
    resolvePromise = null
    rejectPromise = null
    isDebouncing.value = false
  }

  const debounced = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    savedArgs = args
    if (timerId)
      clearTimeout(timerId)

    if (!activePromise) {
      activePromise = new Promise((res, rej) => {
        resolvePromise = res
        rejectPromise = rej
      })
    }

    if (config?.immediate && !timerId) {
      Promise.resolve(callback(...args))
        .then(resolvePromise)
        .catch(rejectPromise)
      timerId = setTimeout(cleanup, delay)
    }
    else {
      isDebouncing.value = true
      timerId = setTimeout(async () => {
        try {
          const result = await callback(...savedArgs!)
          resolvePromise?.(result)
        }
        catch (err) {
          rejectPromise?.(err)
        }
        finally {
          cleanup()
        }
      }, delay)
    }

    return activePromise!
  }

  const cancel = () => {
    rejectPromise?.(new Error('DEBOUNCE_CANCELLED'))
    cleanup()
  }

  const flush = async () => {
    if (!activePromise || !savedArgs)
      return

    const resolve = resolvePromise
    const reject = rejectPromise
    const args = savedArgs
    cleanup()

    try {
      const result = await callback(...args)
      resolve?.(result)
    }
    catch (err) {
      reject?.(err)
    }
  }

  onUnmounted(cancel)
  return { debounced, isDebouncing, cancel, flush }
}
