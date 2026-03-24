import { codeBlock } from '../../../../../utils'
import Practice from './Practice.vue'

const title = 'Prototype'
const path = 'prototype'
const codeBase = `
const array = []
console.dir(array)
`

const paragraph = `
**prototype** — это свойство функции-конструктора (или класса). В нём хранятся методы, которые будут доступны всем экземплярам, и ссылка (__proto__) на prototype родителя.

**__proto__(Object.getPrototypeOf())** — есть у каждого объекта (экземпляра). Это ссылка которая указывает на prototype того конструктора, который создал этот объект.

_Базовый пример:_ 
${codeBlock(codeBase)}
В выводе мы увидим, что у array есть **[[prototype]]**, внутри которого перечислены все методы 
**array**, а также **[[prototype]]** его родителя **object** где перечислены все методы уже **object**

На практике это означает то, что на экземпляре объекта доступны не только его методов, 
но и методы любого из его предков. 
При этом если методы имеют одинаковое название, в приоритете оказывается первый метод 
который был найден в цепочке (от наследников к предкам)
`

export const prototypeData = {
  path,
  title,
  content: paragraph,
  practice: Practice,
}
