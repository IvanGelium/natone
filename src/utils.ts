import type { Ref } from 'vue'
import type { FakeFetchConfig, FakeProject, FakeUser, FakeUserRole, LogMessage, LogMessageType } from '@/types/utils'
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
): Promise<Response> {
  const {
    delay = Math.floor(Math.random() * 5000),
    shouldFail = false,
    onLog,
    returnData = `Запрос ${id} завершен успешно.` as unknown as T,
  } = config

  const failCodes = [400, 401, 403, 404, 500]
  const httpErrorMessages: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized: Для доступа к ресурсу требуется аутентификация',
    403: 'Forbidden: У вас недостаточно прав для просмотра этого контента',
    404: 'Not Found: Запрашиваемый ресурс не найден',
    500: 'Internal Server Error: На сервере произошла непредвиденная ошибка',
  }

  onLog?.('start', `Запрос ${id} отправлен, задержка ${delay} мс`)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        const code = failCodes[Math.floor(Math.random() * failCodes.length)]
        onLog?.('error', `Запрос ${id} упал с кодом ${code}`)

        reject(new Response(JSON.stringify({ status: 'error', message: httpErrorMessages[code] }), {
          status: code,
          statusText: 'Error',
          headers: { 'Content-Type': 'application/json' },
        }))
      }
      else {
        onLog?.('succeed', `Запрос ${id} завершен успешно.`)

        resolve(new Response(JSON.stringify(returnData), {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'application/json' },
        }))
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

/**
 * Vue-composable для создания дебаунс-функции.
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
  return {
    debounced,
    isDebouncing,
    cancel,
    flush,
  }
}

export class FakeData {
  constructor(length: number = Math.floor(Math.random() * 10)) {
    this.projects = this.genProjects(20)
    this.users = this.genUsers(length)
  }

  private _nextId = 1
  public users: FakeUser[] = []
  public projects: FakeProject[] = []

  private _generateUniqueId(): number {
    return this._nextId++
  }

  private _getRandomNumber(startOrEnd: number, end?: number): number {
    const min = end !== undefined ? startOrEnd : 0
    const max = end !== undefined ? end : startOrEnd
    return Math.floor(Math.random() * (max - min)) + min
  }

  private _getRandom<T>(list: T[]): T {
    return list[Math.floor(this._getRandomNumber(list.length))]
  }

  genProjects(length: number = 3): FakeProject[] {
    const titles = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Ksi', 'Lambda']
    const subtitles = ['System', 'Module', 'Research', 'Optimisation', 'Computing', 'Ai']

    this.projects = Array.from({ length }).map(() => ({
      id: this._generateUniqueId(),
      title: `${this._getRandom(titles)} ${this._getRandom(subtitles)}`,
    }))

    return this.projects
  }

  genUsers(length?: number): FakeUser[] {
    const count = length || Math.floor(Math.random() * 8) + 3

    const names = ['Ivan', 'Alice', 'John', 'Elena', 'Mike', 'Jordan', 'Jin', 'Jane', 'Gregory', 'Piter', 'Harry']
    const surnames = ['Ivanov', 'Smith', 'Doe', 'Berova', 'Wazowski', 'Varnov', 'Danster', 'Baklaher', 'Delyavidos']
    const roles: FakeUserRole[] = ['admin', 'user', 'guest']

    this.users = Array.from({ length: count }).map(() => {
      let projectId: number[] = []
      if (Math.random() > 0.1) {
        const rawIds = Array.from({ length: this._getRandomNumber(1, 4) })
          .map(() => this._getRandom(this.projects).id)
        projectId = [...projectId, ...rawIds]
      }
      else {
        projectId = []
      }

      return {
        id: this._generateUniqueId(),
        name: `${this._getRandom(names)} ${this._getRandom(surnames)}`,
        role: this._getRandom(roles),
        isActive: Math.random() > 0.3,
        projectId,
      }
    })

    return this.users
  }
}
