import { codeBlock } from '../../../../../utils'
import Practice from './Practice.vue'

const title = `Utility Types`
const path = `utilityTypes`

const paragraph = `
**Utility Types** - это более сложные нативные 
типы **TS** которые используют дженерики и 
предоставляют базовый функционал который часто необходим в работе. 

**Partial<T>** - берет типы полей из **T**, но делает их 
необязательными. Позволяет гарантировать что полученный тип является 'подтипом' **T**
_Пример:_
${codeBlock(`
function updateUser(params: Partial<User>) {...}
`)}


**Required<T>** - берет типы полей из **T** и делает их обязательными. Позволяет 
гарантировать что новый тип будет иметь все поля что и T, в том числе и не обязательные. 
_Пример:_
${codeBlock(`
type strictUser = Required<User>
`)}


**Readonly<T>** - берет типы полей из **T** и делает их только для чтения. 
Позволяет гарантировать что значения полей не будут изменены. 

_Пример:_ 
${codeBlock(`
function isUserReady(state:Readonly<UserState>): boolean {...}
`)}


**Pick<T, Keys>** - берет конкретные типы полей **T** по ключам Keys и создает 
новый тип только из этих конкретных ключей. 
_Пример:_ 
${codeBlock(`
function sendLetter(contacts: Pick<User, 'email'): ApiResponse {...}
`)}


**Omit<T, Keys>** - берет конкретные типы полей **T** по ключам Keys, отбрасывает их 
и создает новый тип. 
_Пример:_ 
${codeBlock(`
type anonymousUser = Omit<User, 'name' | 'email' | 'phone'>
`)}


**Record<Keys, T>** - создает тип для словарей, 
где **Keys** это ключи, а **T** это значения. 
_Пример:_ 
${codeBlock(`
type columnVacanciesMap = Record<'new' | 'inProgress' | 'done', Vacancy[]>
`)}


**ReturnType<T>** - служит для извлечения типа возвращаемого функцией значения. 
_Пример:_ 
${codeBlock(`
function dataProcessingStepTwo(data: ReturnType<typeof dataProcessingStepOne>)
`)}


**Parameters<T>** - служит для извлечения типов параметров функции. 
Возвращает типы в кортеже.  
_Пример:_ 
${codeBlock(`
type processUserParametersType = Parameters<typeof processUser>
`)}


**Exclude<T, U>** - позволяет исключить из **union T** тип **U**
_Пример:_ 
${codeBlock(`
type status = 'open'|'closed'|'pending' | 'error'
type finishedStatus = Exclude<status, 'pending'|'error'>
`)}


**Extract<T, U>** - позволяет получить только типы **U** которые пересекаются с **union T**
_Пример:_
${codeBlock(`
type status = 'open'|'closed'|'pending' | 'error'
type unfinishedStatus = Extract<status, 'pending'|'error'|'loading'|'fetching'>
`)}


**NonNullable<T>** - исключает из типа **union T** все **null** и **undefined**
_Пример:_ 
${codeBlock(`
const resp = fetch() as ApiResponse | undefined 
const cleanResp = NonNullable<typeof resp>
`)}


**Awaited<T>** - позволяет получить тип внутри промиса. Работает рекурсивно, пока не избавиться от всех слоев промисов. 
_Пример:_ 
${codeBlock(`
type resp = Awaited<ReturnType<typeof fetchUser>>
`)}


**ConstructorParameters<T>** - аналог **Parameters<T>**, только извлекает тип из 
параметров конструктора класса **T**
_Пример:_ 
${codeBlock(`
type UserParams = ConstructorParameters<typeof User>
`)}


**InstanceType<T>** - извлекает тип экземпляра класса **T**
_Пример:_ 
${codeBlock(`
type UserInstance = InstanceType<typeof User>
`)}


**Capitalize<T>, Uncapitalize<T>, Uppercase<T>, Lowercase<T>** - типы для работы со 
строковыми литералами **T**
`

export const utilityTypesData = {
  path,
  title,
  content: paragraph,
  practice: null,
}
