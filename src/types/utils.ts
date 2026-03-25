export type LogMessageType = 'start' | 'error' | 'succeed'

export interface LogMessage {
  type: LogMessageType
  message: string
  timestamp: Date
}

export interface FakeFetchConfig<T> {
  /** Задержка ответа в миллисекундах (по умолчанию случайная задержка до 5 секунд */
  delay?: number
  /** Если true, промис завершится ошибкой */
  shouldFail?: boolean
  /** Данные, которые вернет функция при успешном выполнении */
  returnData?: T
  /** Коллбэк для логирования процесса выполнения */
  onLog?: (type: LogMessageType, message: string) => void
}

export type FakeUserRole = 'admin' | 'user' | 'guest'

export interface FakeProject {
  id: number
  title: string
}

export interface FakeUser {
  id: number
  name: string
  role: FakeUserRole
  isActive: boolean
  projectId: number[]
}

export class FakeDataType {
  public users: FakeUser[] = []
  public projects: FakeProject[] = []
}
