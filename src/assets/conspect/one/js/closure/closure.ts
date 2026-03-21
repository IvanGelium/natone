import { codeBlock } from '../../../../../utils'
import Practice from './Practice.vue'

const path = 'closure'

const title = 'Замыкания'
const codeBaseClosure = `
function withClosure(specialVar) {
  return () => {
    console.log(specialVar)
  }
}

const closured = withClosure("imClosured")
closured() // в консоль будет выведено imClosured
`

const codeClusureIncapsulation = `
function withSecret() {
  let secret
  return {
    setSecret: (newSecret) => {secret = newSecret}
    tellSecret: () => {console.log(secret)}
  }
}

const person = withSecret()
person.setSecret("beans")
person.tellSecret() // вывод в консоль beans
person.secret // undefined, такого поля не существует в текущем контексте
`

const codeClosureCarry = `
function createLogger(logContext) {
  return (log) => {
    console.log(\`\${logContext:} \${log}\`)
  }
}

const logger = createLogger("Модуль сжатия файлов")

logger("Файл имеет недопустимый формат") 
// Получим вывод в консоль: Модуль сжатия файлов: Файл имеет недопустимый форма
`
const paragraph = `
**Замыкания** - это возможность внутренней функции возвращаемой внешней функцией
получить доступ к переменным объявленным во внешней функции.

_Базовые пример замыкания_: 
${codeBlock(codeBaseClosure)}
В этом примере мы объявляем функцию **withClosure** с параметром **specialVar**. 
Внутри функции мы возвращаем анонимную функцию, которая будет иметь доступ к 
переменной **specialVar** когда она будет вызвана, несмотря на то что внешняя
функция **withClosure** уже отработала. Из-за замыкания, переменные созданные в 
контексте внешней функции продолжают существовать пока замыкание не будет разрешено 
через удаление ссылки на функцию. 

**Важно:** С замыканием следует проявлять осторожность, так как они не дают сборщику мусора избавиться от переменных пока не будет удалена ссылка на замыкаемую функцию.

_Базовый пример инкапсуляции с помощью замыкания_:
${codeBlock(codeClusureIncapsulation)}
В этом примере мы создали что-то наподобие класса с методами. У ‘класса’ есть поле 
**secret**, оно недоступно никаким образом, кроме как с помощью ‘методов’
**setSecret** и **tellSecret**, возвращаемых функцией **withSecret**. 

_Базовый пример каррирование_:
${codeBlock(codeClosureCarry)}
В этом примере мы создали подобие класса логгера, при вызове **createLogger**, 
мы передаем ему название текущего окружения. Далее мы используем полученный **logger**, 
чтобы выводить данные в консоль, при этом в выводимой строке мы используем данные которые были 
сохранены при создание логгера. 
`
export const closureData = {
  path,
  title,
  content: paragraph,
  practice: Practice,
}
