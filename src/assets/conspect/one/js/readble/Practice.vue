<script setup lang="ts">
import { ElButton, ElSelect, ElSlider } from 'element-plus'

const isRunning = ref(false)
const deadzone = 2
const ctxW = 800
const ctxH = 600
const ctxWD = ctxW + deadzone
const ctxHD = ctxH + deadzone
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const cellArray = shallowRef<Uint8Array>(new Uint8Array(ctxWD * ctxHD))
const currentCellArray = shallowRef<Uint8Array>(new Uint8Array(ctxWD * ctxHD))
const animationId = ref<number | null>(null)
const currentDensity = ref(50)
const patterns = [
  {
    label: 'Glider',
    value: [1, ctxWD + 2, ctxWD * 2, ctxWD * 2 + 1, ctxWD * 2 + 2],
  },
  {
    label: 'Glider Gun',
    value: [
      24,
      ctxWD + 22,
      ctxWD + 24,
      ctxWD * 2 + 12,
      ctxWD * 2 + 13,
      ctxWD * 2 + 20,
      ctxWD * 2 + 21,
      ctxWD * 2 + 34,
      ctxWD * 2 + 35,
      ctxWD * 3 + 11,
      ctxWD * 3 + 15,
      ctxWD * 3 + 20,
      ctxWD * 3 + 21,
      ctxWD * 3 + 34,
      ctxWD * 3 + 35,
      ctxWD * 4 + 0,
      ctxWD * 4 + 1,
      ctxWD * 4 + 10,
      ctxWD * 4 + 16,
      ctxWD * 4 + 20,
      ctxWD * 4 + 21,
      ctxWD * 5 + 0,
      ctxWD * 5 + 1,
      ctxWD * 5 + 10,
      ctxWD * 5 + 14,
      ctxWD * 5 + 16,
      ctxWD * 5 + 17,
      ctxWD * 5 + 22,
      ctxWD * 5 + 24,
      ctxWD * 6 + 10,
      ctxWD * 6 + 16,
      ctxWD * 6 + 24,
      ctxWD * 7 + 11,
      ctxWD * 7 + 15,
      ctxWD * 8 + 12,
      ctxWD * 8 + 13,
    ],
  },
  {
    label: 'Small Exploder',
    value: [1, ctxWD, ctxWD + 1, ctxWD + 2, ctxWD * 2, ctxWD * 2 + 2, ctxWD * 3 + 1],
  },
  {
    label: 'Lightweight Spaceship',
    value: [1, 4, ctxWD, ctxWD * 2, ctxWD * 2 + 4, ctxWD * 3, ctxWD * 3 + 1, ctxWD * 3 + 2, ctxWD * 3 + 3],
  },
  {
    label: 'Pulsar',
    value: [
    // Верхняя горизонтальная часть
      2,
      3,
      4,
      8,
      9,
      10,
      ctxWD * 5 + 2,
      ctxWD * 5 + 3,
      ctxWD * 5 + 4,
      ctxWD * 5 + 8,
      ctxWD * 5 + 9,
      ctxWD * 5 + 10,
      // Нижняя горизонтальная часть
      ctxWD * 7 + 2,
      ctxWD * 7 + 3,
      ctxWD * 7 + 4,
      ctxWD * 7 + 8,
      ctxWD * 7 + 9,
      ctxWD * 7 + 10,
      ctxWD * 12 + 2,
      ctxWD * 12 + 3,
      ctxWD * 12 + 4,
      ctxWD * 12 + 8,
      ctxWD * 12 + 9,
      ctxWD * 12 + 10,

      // Левая вертикальная часть
      ctxWD * 2,
      ctxWD * 3,
      ctxWD * 4,
      ctxWD * 2 + 5,
      ctxWD * 3 + 5,
      ctxWD * 4 + 5,
      ctxWD * 8,
      ctxWD * 9,
      ctxWD * 10,
      ctxWD * 8 + 5,
      ctxWD * 9 + 5,
      ctxWD * 10 + 5,

      // Правая вертикальная часть
      ctxWD * 2 + 7,
      ctxWD * 3 + 7,
      ctxWD * 4 + 7,
      ctxWD * 2 + 12,
      ctxWD * 3 + 12,
      ctxWD * 4 + 12,
      ctxWD * 8 + 7,
      ctxWD * 9 + 7,
      ctxWD * 10 + 7,
      ctxWD * 8 + 12,
      ctxWD * 9 + 12,
      ctxWD * 10 + 12,
    ],
  },
  {
    label: 'Ten Cell Row',
    value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    label: 'R-Pentomino',
    value: [1, 2, ctxWD, ctxWD + 1, ctxWD * 2 + 1],
  },
]
const currentPattern = ref(patterns[0])

function initCtx() {
  if (!canvasRef.value)
    return
  ctx.value = canvasRef.value.getContext('2d')
  if (!ctx.value)
    return
  ctx.value.fillStyle = '#00ff00'
}

function handleClear() {
  if (isRunning.value) {
    toggleUpdate()
  }

  for (let i = 0; i < currentCellArray.value.length; i++) {
    currentCellArray.value[i] = 0
  }
  render()
}

//##################
//##################

onMounted(() => {
  initCtx()
  render()
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
})

function handleRandom() {
  if (!isRunning.value) {
    toggleUpdate()
  }
  const density = currentDensity.value / 100
  for (let i = 0; i < currentCellArray.value.length; i++) {
    currentCellArray.value[i] = Math.random() > density ? 1 : 0
  }
  render()
}

function handleCanvasClick(e: MouseEvent) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect)
    return
  const x = Math.floor(e.clientX - rect.left)
  const y = Math.floor(e.clientY - rect.top)
  const i = y * ctxWD + x

  currentPattern.value.value.forEach((offset) => {
    if (i + offset < currentCellArray.value.length) {
      currentCellArray.value[i + offset] = 1
    }
  })

  render()
  if (!isRunning.value)
    toggleUpdate()
}

function toggleUpdate() {
  if (animationId.value) {
    stopUpdate()
  }
  else {
    update()
  }
  isRunning.value = !isRunning.value
}

function stopUpdate() {
  if (animationId.value !== null) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
}

const offsetsAround = {
  nw: -ctxWD - 1,
  n: -ctxWD,
  ne: -ctxWD + 1,
  w_le: -1,
  e: 1,
  sw: ctxWD - 1,
  s: ctxWD,
  se: ctxWD + 1,
}

function update() {
  const { nw, n, ne, w_le, e, sw, s, se } = offsetsAround
  const current = currentCellArray.value
  const next = cellArray.value
  let rowOffset = ctxWD
  for (let y = 1; y <= ctxH; y++) {
    for (let x = 1; x <= ctxW; x++) {
      const index = rowOffset + x
      const sum = current[index + nw] + current[index + n] + current[index + ne]
        + current[index + w_le] + current[index + e]
        + current[index + sw] + current[index + s] + current[index + se]
      const isAlive = current[index]
      next[index] = +(sum === 3) | (+isAlive & +(sum === 2))
    }
    rowOffset += ctxWD
  }
  const temp = currentCellArray.value
  currentCellArray.value = cellArray.value
  cellArray.value = temp
  render()
  animationId.value = requestAnimationFrame(update)
}

let imageData: ImageData | null = null
let pixels32: Uint32Array | null = null
const colorAlive = 0xFF00FF00 // Зеленый
const colorDead = 0xFF000000 //  черный
function render() {
  const current = currentCellArray.value
  const locCtx = ctx.value
  if (!locCtx)
    return
  if (!imageData) {
    imageData = locCtx.createImageData(ctxW, ctxH)
    pixels32 = new Uint32Array(imageData.data.buffer)
  }
  const p32 = pixels32!
  let rowOffset = ctxWD
  let canvasOffset = 0

  for (let y = 1; y <= ctxH; y++) {
    for (let x = 1; x <= ctxW; x++) {
      p32[canvasOffset + (x - 1)] = current[rowOffset + x] === 1 ? colorAlive : colorDead
    }
    rowOffset += ctxWD
    canvasOffset += ctxW
  }

  locCtx.putImageData(imageData, 0, 0)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div>
        Клеточный автомат с большим числом клеток (~500 000)
      </div>
      <div>
        Цель: отрисовать тяжелую логику, предельно ее оптимизировав
      </div>
      <div>
        Результат: Использование специального типа Uint8Array, разворавивание циклов,
        вычисление с помощью побитовых операций вместо ветвления, отказ от функций в основном цикле и предрасчёт смещений позволили улучшить производительность в ~100 раз
      </div>
    </div>
    <div class="flex flex-col gap-2 " :style="`max-width: ${ctxW + 8}px;`">
      <div class="font-bold ">
        Холст
      </div>

      <div class="border border-primary-500 rounded-xl bg-black p-1">
        <canvas
          id="automataCanvas"
          ref="canvasRef"

          :width="ctxW"
          :height="ctxH"
          @click="handleCanvasClick"
        />
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex gap-4">
          <ElButton
            type="primary"
            class="w-full"
            @click="toggleUpdate()"
          >
            {{ isRunning ? 'Остановить' : 'Запустить' }}
          </ElButton>
          <ElSelect v-model="currentPattern">
            <el-option
              v-for="(pattern, index) in patterns"
              :key="`index-${index}-${pattern.label}`"
              :label="pattern.label"
              :value="pattern"
            />
          </ElSelect>
        </div>

        <div class="flex gap-4">
          <ElButton
            type="primary"
            class="w-full"
            @click="handleRandom"
          >
            Случайно
          </ElButton>
          <ElSlider v-model="currentDensity" />
        </div>
        <ElButton
          class="w-full"
          type="primary"
          @click="handleClear"
        >
          Очистить
        </ElButton>
      </div>
    </div>
  </div>
</template>
