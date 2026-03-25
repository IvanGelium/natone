<script setup lang="ts">
import { ArrowRightBold } from '@element-plus/icons-vue'

type Types = 'number' | 'string' | 'array' | 'function' | 'object' | 'class'
const protoType = ref<Types>('number')
const chain = computed(() => getChain(getType(protoType.value)))
function getChain(prim: any) {
  let proto = Object.getPrototypeOf(new Object(prim))
  const chain = []

  while (proto) {
    const allProps = Object.getOwnPropertyNames(proto)
    const methods = allProps.filter((prop) => {
      try {
        return typeof proto[prop] === 'function'
      }
      catch {
        return false
      }
    })

    chain.push({
      name: proto.constructor.name,
      methods: methods.sort(),
    })
    proto = Object.getPrototypeOf(proto)
  }

  return chain
}

class Example {}

class Chain extends Example { }

class Prototype extends Chain {}

function getType(t: Types) {
  switch (t) {
    case 'number':
      return Number.NaN
    case 'string':
      return 'a'
    case 'array':
      return []
    case 'function':
      return () => { }
    case 'object':
      return {}
    case 'class':
      return new Prototype()
  }
}

const customMethodName = ref('sayHello')
const isApplied = ref(false)

function applyToPrototype() {
  (String.prototype as any)[customMethodName.value] = function () {
    return `Привет, я строка. Мой контент: "${this}"`
  }
  isApplied.value = true
}

const testString = ref('Vue JS')
</script>

<template>
  <div>
    <div>
      <el-radio-group v-model="protoType" class="rounded-xl p-2">
        <el-radio-button border size="large" value="number">
          Число
        </el-radio-button>
        <el-radio-button border size="large" value="string">
          Строка
        </el-radio-button>
        <el-radio-button border size="large" value="array">
          Массив
        </el-radio-button>
        <el-radio-button border size="large" value="object">
          Объект
        </el-radio-button>
        <el-radio-button border size="large" value="function">
          Функция
        </el-radio-button>
        <el-radio-button border size="large" value="class">
          Класс
        </el-radio-button>
      </el-radio-group>
    </div>
    <div>
      Вывод данных о цепочках прототипов для разных типов JS:
    </div>
    <div class="flex gap-2 p-2">
      <div v-for="(val, index) in chain" :key="`${index}-${val.name}`">
        <div class="flex flex-col">
          <div class="flex gap-2 items-center">
            <div class=" bg-primary-200 p-2 rounded border border-primary-300">
              <p class="font-bold">
                {{ val.name }}
              </p>
              <div class="max-h-100 overflow-auto">
                <p class="text-sm">
                  Методы:
                </p>
                <div v-for="(method, i) in val.methods" :key="`${i}-${method}`" class="flex flex-col text-xs">
                  {{ method }}
                </div>
              </div>
            </div>
            <ArrowRightBold v-if="chain.length - 1 !== index" class="h-5" />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 rounded shadow-sm">
      <h3 class="font-bold mb-2" />
      <p>Добавлкение нового метода в <code>String.prototype</code>:</p>

      <div class="flex gap-2 mb-4">
        <el-input v-model="customMethodName" placeholder="Имя метода" />
        <el-button type="primary" @click="applyToPrototype">
          Внедрить
        </el-button>
      </div>

      <div v-if="isApplied" class="bg-primary-200 p-2 rounded">
        <p>Теперь всем строкам доступен метод: <code>.{{ customMethodName }}()</code></p>
        <code>"{{ testString }}".{{ customMethodName }}()  => </code>
        <b>{{ (testString as any)[customMethodName]() }}</b>
      </div>
    </div>
  </div>
</template>
