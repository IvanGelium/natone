import { codeBlock } from '../../../../../utils'
import Practice from './Practice.vue'

const title = 'This'
const path = 'this'

const codeBase = `
class Person{
  #name
  #secret
  constructor(name,secret) {
    this.#name = name
    this.#secret = secret
  }

  sayName() {
  console.log(this.#name)
  }
  setSecret(newSecret) {
  this.#secret = newSecret 
  }
}
const person = new Person("Яна", "Любит пиццу с ананасами")
person.sayName() //"Выведет в консоль Яна" 
`

const codeSmall = `
const speak = person.sayName
speak()  // Выведет в консоль undefined
`

const codeSmallTwo = `
sayName: () => {...}
`

const paragraph = `
**this** - это специальное ключевое слово доступное в контексте класса,
для обращения к экземпляру этого класса, и в контексте объекта,
для обращения к самому себе.

_Базовый пример использования_:
${codeBlock(codeBase)}
В этом примере мы создали класс **Person**, у класса есть поля **name** и **secret**, к
оторые задаются через конструктор класса, для обращения к полям внутри 
класса используется **this**. 

Важный момент, **this** существует только пока на метод который его 
использует ссылается экземпляр класса. 
Если мы изменим ссылку на другое значение, **this** будет потерян. 
${codeBlock(codeSmall)}

Второй важный момент, в поле класса можно записать анонимную функцию
${codeBlock(codeSmallTwo)}
Анонимные функции всегда пробуют найти **this** во внешнем контексте. 
Теперь при создание экземпляра класса, мы создадим внутри него новый 
метод именного этого объекта (вместо ссылки на метод класса) и этот метод 
будет использовать **this** этого экземпляра. 

Третий важный момент, у методов существует свой метод **bind** который 
позволяет привязывать **this**. Вызывая **sayName.bind(this)**, 
мы получаем новый метод с функционалом оригинального метода, 
с сохранением у него доступа к переданному **this** 

Четвертый важный момент, **this** доступен в глобальном уровне среды 
выполнения кода (браузер, node) и ссылается на контекст в котором выполняется. 
`

export const thisData = {
  path,
  title,
  content: paragraph,
  practice: Practice,
}
