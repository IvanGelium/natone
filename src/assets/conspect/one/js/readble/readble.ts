import { codeBlock } from '../../../../../utils'
import Practice from './Practice.vue'

const title = `Читаемые преобразования данных`
const path = 'readble'

const codeBase = `
const users = [{...}]
// Императивный подход
const filteredUsers = []
for (let i = 0; i < users.length; i++) {
  if (users[i].age > 18) {
    filteredUsers.push(users[i])
  }
}

// Декларативный подход
const filteredUsers = users.filter((u)=>u.age > 18)
`

const codeChain = `
const userPermissions = {
  vacancies: true,
  applicants: true,
  requests: true,
}
Object
.entries(userPermissions)
.filter(([_key,value])=> value )
.map(([key,_value])=> key)

// С помощью чейнинга легко отследить какие преобразования происходят с 
// данными и понять финальный результат
`

const codeLog = `
const users = [{...}]
users.filter(hasPermissions)
function hasPermissions(user) {
  if (!user) return 
false
  return user.permissions.includes('vacancies')
&& user.permissions.includes('applicants') 
&& user.memberType !== 'watcher'
}
`

const paragraph = `
Читаемая работа с данными это набор практик которые упрощают 
восприятие кода и работу с ним. 

**Использование декларативного подхода**

Код написанный в декларативном стиле более читаем, методы 
сами подсказывают результат своей работы. 

_Пример:_
${codeBlock(codeBase)}

Декларативный подход значительно более читаемый и ёмкий

**Иммутабельность**

Позволяет избежать большинства проблем с ссылочными типами данных. 

**Чейнинг**

Упрощает восприятие кода, в ситуацию когда необходимо произвести много преобразований данных. 

_Пример:_
${codeBlock(codeChain)}

**Вынос логики в отдельные функции**

Вынос логики в именованные функции задает контекст через 
название функции, упрощаем её визуальное восприятие. 

_Пример:_
${codeBlock(codeLog)}
В этом примере сразу понятна цель фильтрации пользователей, 
а вынесенную функцию впоследствии можно переиспользовать. 

**Нормализация данных**

Приведение исходных данных в единый вид упрощает их восприятие 
и позволяет переиспользовать функции для работы с данными. 
`

export const readbleData = {
  path,
  title,
  content: paragraph,
  practice: Practice,
}
