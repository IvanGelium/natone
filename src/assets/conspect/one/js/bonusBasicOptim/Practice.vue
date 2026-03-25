<script setup lang="ts">
import { ElButton, ElSelect, ElSlider } from 'element-plus'

const isRunning = ref(false)
const cellSize = ref(1)
const deadzone = 2
const ctxW = computed(() => 800 / cellSize.value)
const ctxH = computed(() => 600 / cellSize.value)
const ctxWD = ctxW.value + deadzone
const ctxHD = ctxH.value + deadzone
const canvasW = computed(() => ctxW.value * cellSize.value)
const canvasH = computed(() => ctxH.value * cellSize.value)
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
  const current = currentCellArray.value
  for (let i = 0; i < current.length; i++) {
    current[i] = Math.random() > density ? 1 : 0
  }
  render()
}
function handleOdd() {
  if (!isRunning.value) {
    toggleUpdate()
  }

  const current = currentCellArray.value
  for (let i = 0; i < current.length; i++) {
    current[i] = i % 2 ? 1 : 0
  }
  render()
}

function handleCanvasClick(e: MouseEvent) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect)
    return
  const size = cellSize.value
  const x = Math.floor((e.clientX - rect.left) / size)
  const y = Math.floor((e.clientY - rect.top) / size)
  const i = (y + 1) * ctxWD + (x + 1)

  const pattern = currentPattern.value.value
  const current = currentCellArray.value
  for (let p = 0; p < pattern.length; p++) {
    const offset = pattern[p]
    if (i + offset < current.length) {
      current[i + offset] = 1
    }
  }

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
  const h = ctxH.value
  const w = ctxW.value
  let rowOffset = ctxWD
  for (let y = 1; y <= h; y++) {
    for (let x = 1; x <= w; x++) {
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
  const size = cellSize.value
  const width = canvasW.value
  const height = canvasH.value
  const h = ctxH.value
  const w = ctxW.value
  if (!imageData) {
    imageData = locCtx.createImageData(width, height)
    pixels32 = new Uint32Array(imageData.data.buffer)
  }
  const p32 = pixels32!
  for (let y = 0; y < h; y++) {
    const rowOffset = (y + 1) * ctxWD + 1
    for (let x = 0; x < w; x++) {
      const isAlive = current[rowOffset + x] === 1
      const color = isAlive ? colorAlive : colorDead
      for (let sy = 0; sy < size; sy++) {
        const canvasRowOffset = (y * size + sy) * width
        for (let sx = 0; sx < size; sx++) {
          p32[canvasRowOffset + (x * size + sx)] = color
        }
      }
    }
  }

  locCtx.putImageData(imageData, 0, 0)
}

watch(cellSize, () => {
  imageData = null
  pixels32 = null
  render()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div>
        Клеточный автомат с большим числом клеток (~500 000)
      </div>
      <div>
        Цель: отрисовать тяжелую логику предельно ее оптимизировав
      </div>
      <div>
        Результат: Использование специального типа Uint8Array, разворавивание циклов,
        вычисление с помощью побитовых операций вместо ветвления, отказ от функций в основном цикле и предрасчёт смещений позволили улучшить производительность в ~100 раз
      </div>
    </div>
    <div class="flex flex-col gap-2 " :style="`max-width: ${canvasW + 8}px;`">
      <div class="font-bold ">
        Холст
      </div>

      <div class="cursor-pointer border border-primary-500 rounded-xl bg-black p-1 overflow-auto">
        <canvas
          id="automataCanvas"
          ref="canvasRef"

          :width="canvasW"
          :height="canvasH"
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
          <div class="flex min-w-1/2">
            <ElButton
              type="primary"
              class="w-full"
              @click="handleRandom"
            >
              Случайно
            </ElButton>
            <ElButton
              type="primary"
              class="w-full"
              @click="handleOdd"
            >
              Через одну
            </ElButton>
          </div>
          <ElSlider v-model="currentDensity" />
        </div>
        <div class="flex gap-4">
          <ElButton
            class="min-w-1/2"
            type="primary"
            @click="handleClear"
          >
            Очистить
          </ElButton>
          <div class="flex w-full">
            <ElButton
              class="w-full"
              type="primary"
              @click="cellSize = 1"
            >
              Клетка х1
            </ElButton>
            <ElButton
              class="w-full"
              type="primary"
              @click="cellSize = 4"
            >
              Клетка х4
            </ElButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
