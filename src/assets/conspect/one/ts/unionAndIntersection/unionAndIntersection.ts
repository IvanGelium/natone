import { codeBlock } from '../../../../../utils'
import Practice from './Practice.vue'

const title = `Union/Intersection`
const path = `unionAndIntersection`

const codeBase = `
interface Individual extends User {...}
interface LegalEntity extends User {...}
type account = Individual | LegalEntity
// аккаунт может иметь тип физического или юридического лица
type tabName = 'Канбан' | 'Список'
// Тип tabName допускает только две конкретных строки
`

const codeBaseTwo = `
interface User {
  id: number
  name: string
}
//Склеиваем в один
type withDateData = User & {
  createdAt: Date
  updatedAt: Date
}

const userWithDateData: withDateData = {
id: 15
name: 'ivan'
createdAt: new Date()
updatedAt: new Date()
}
`

const codeThree = `
type what = string & number
`

const paragraph = `
Это логические операторы для типов, которые позволяют 'расширять' или 'склеивать' 
типы между собой. 

union имеет синтаксис **|** и служит логическим ИЛИ, объявляет что это значение 
может быть одним из представленных типов. 

_Пример:_
${codeBlock(codeBase)}


**intersection** имеет синтаксис **&** и служит логическим И, объявляет что 
это значение должно иметь все предоставленные типы. Используется для композиции 
интерфейсов. 

_Пример_
${codeBlock(codeBaseTwo)}
Дополняем существующий интерфейс новыми полями, без необходимости отдельно 
расширять его через наследование. 

Важный момент: Неаккуратное использование **&** может привести к образованию 
типа **never**, например 
${codeBlock(codeThree)}
`

export const unionAndIntersectionData = {
  path,
  title,
  content: paragraph,
  practice: null,
}
