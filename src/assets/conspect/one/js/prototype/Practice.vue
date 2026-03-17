<script setup lang="ts">
import { ElRadio } from 'element-plus'

const protoType = ref('number')

function getChain(prim: any) {
  let proto = Object.getPrototypeOf(new Object(prim))
  const chain = []

  while (proto) {
    chain.push(proto.constructor.name)
    proto = Object.getPrototypeOf(proto)
  }
  return `${chain.join(' -> ')} -> null`
}

class Example {}

class Chain extends Example { }

class Prototype extends Chain {}

function getType(t) {
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
      Вычисляемая строка в которой записана цепочка прототипов выбранного типа:
    </div>
    <div>
      {{ getChain(getType(protoType)) }}
    </div>
  </div>
</template>

<style scoped>
  .elradio {
  background-color: var(--color-primary-500);
}
</style>
