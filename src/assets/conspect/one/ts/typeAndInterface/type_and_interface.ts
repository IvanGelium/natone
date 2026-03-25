import { codeBlock } from '../../../../../utils'
import Practice from './Practice.vue'

const title = `Type и interface`
const path = `type_and_interface`

const codeBase = `
type id = number
function updateUser(id:id) {...}
`

const codeTwo = `
type tupleType = [someType, string | number, someInterface?,]
`

const codeThree = `
type tupleTypeTwo = [id: number, ...data: DataType[]]
`

const codeFour = `
type frameType = 'Седан' | 'Хэтчбек'
type fuelType = Gas | Oil

interface Volume {
width: number
length: number
depth: number
}

interface Trunk {
  volume: Volume
  …
}

interface Car {
  readonly id: number
  name: string
  createdAt: Date
  frame: frameType
  drive: (fuel: fuelType) => Location
  trunk?: Trunk
} 

interface ElectricCar extends Car {
  batteryCapacity: number
  charge(power: Power): chargeStatus
}
`

const paragraph = `
Типы и интерфейсы это два вида типизации данных в **TS**

Типы используются для типизации любых данных, для этого **TS** имеет набор нативных 
типов (number, string, boolean и т.д) и позволяет создавать алиасы и составные типы 
из типов, литералов и интерфейсов 

_Пример использования типов:_ 
${codeBlock(codeBase)}
Явно указываем что в эту функцию можно передать только числовой тип данных


Интерфейсы используются для типизации классов и объектов, зачастую представляют 
из себя набор типов и интерфейсов описывающих поля и методы объекта.
 
Важный момент: типизация метода включает в себя типизацию названия, параметров и 
вывода метода. 

Второй важный момент: у типов в интерфейсе существуют модификаторы **?** и **readonly** 
которые позволяют сделать поля опциональными и только для чтения соответственно 
(только для проверки **TS**, код все равно будет возможно запустить) 

Третий важный момент: интерфейсы можно расширять, либо через создание нового 
интерфейса с тем же названием, либо через синтаксис **extends**

Четвертый важный момент: типы могут иметь структуру кортежа и задаваться как 
${codeBlock(codeTwo)}
такой тип требует передать массив элементов с подходящими типами, в порядке, в которой 
они указаны в типе. 
Также доступно использование меток и возможность указать любое число типов. 
${codeBlock(codeThree)}


_Пример_:
${codeBlock(codeFour)}
В этом примере мы использовали несколько обычных типов, составных типов и интерфейсов 
чтобы создать интерфейс машины.
`

export const typeAndInterfaceData = {
  path,
  title,
  content: paragraph,
  practice: null,
}
