<script setup lang="ts">
import { ElButton } from 'element-plus'

const isRunning = ref(false)
const ctxW = 400
const ctxH = 300
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const cellArray = ref<Uint8Array>(new Uint8Array(ctxW * ctxH))
const currentCellArray = ref<Uint8Array>(new Uint8Array(ctxW * ctxH))
const animationId = ref<number | null>(null)
interface Coordinates {
  x: number
  y: number
}

function initCtx() {
  if (!canvasRef.value)
    return
  ctx.value = canvasRef.value.getContext('2d')
  if (!ctx.value)
    return
  ctx.value.fillStyle = '#00ff00'
}

// function indexCoor(index: number): Coordinates {
//   return {
//     x: index % ctxW,
//     y: Math.floor(index / ctxW),
//   }
// }
function coorIndex({ x, y }: Coordinates): number {
  return y * ctxW + x
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

function update() {
  // 1. Считаем из CURRENT в NEXT (cellArray)
  for (let i = 0; i < currentCellArray.value.length; i++) {
    calcNextArray(i)
  }

  // 2. Копируем результат в CURRENT для следующего шага
  currentCellArray.value.set(cellArray.value)

  // 3. Рисуем актуальное состояние
  render()

  // 4. Запрашиваем следующий кадр
  animationId.value = requestAnimationFrame(update)
}

function toggleUpdate() {
  if (animationId.value) {
    stopUpdate()
  }
  else {
    update() // Запускает цикл заново
  }
  isRunning.value = !isRunning.value
}

function render() {
  if (!ctx.value)
    return
  ctx.value.clearRect(0, 0, ctxW, ctxH)

  // Рисуем из currentCellArray, так как именно туда мы сделали .set()
  for (let i = 0; i < currentCellArray.value.length; i++) {
    if (currentCellArray.value[i] === 1) {
      const x = i % ctxW
      const y = Math.floor(i / ctxW)
      ctx.value.fillRect(x, y, 1, 1)
    }
  }
}

function calcNextArray(index: number) {
  const neighborsSum = calcNeighboors(index)
  const isAlive = currentCellArray.value[index] === 1

  if (isAlive) {
    cellArray.value[index] = (neighborsSum === 2 || neighborsSum === 3) ? 1 : 0
  }
  else {
    cellArray.value[index] = (neighborsSum === 3) ? 1 : 0
  }
}

// function findNeighboors(index: number): Uint8Array {
//   const neighboors = new Uint8Array(8)
//   for (let i = 0; i < neighboors.length; i++) {
//     neighboors[i] = getNeighborIndex(i, index)
//   }
//   return neighboors
// }

function calcNeighboors(index: number): number {
  let count = 0
  for (let i = 0; i < 8; i++) {
    const neighborIndex = getNeighborIndex(i, index)
    // Проверяем, что индекс в пределах массива
    if (neighborIndex >= 0 && neighborIndex < currentCellArray.value.length) {
      count += currentCellArray.value[neighborIndex]
    }
  }
  return count
}

function getNeighborIndex(position: number, index: number): number {
  const x = index % ctxW
  const y = Math.floor(index / ctxW)

  switch (position) {
    case 0: // верхний
      return y > 0 ? index - ctxW : -1
    case 1: // верхний правый
      return y > 0 && x < ctxW - 1 ? index - ctxW + 1 : -1
    case 2: // правый
      return x < ctxW - 1 ? index + 1 : -1
    case 3: // нижний правый
      return y < ctxH - 1 && x < ctxW - 1 ? index + ctxW + 1 : -1
    case 4: // нижний
      return y < ctxH - 1 ? index + ctxW : -1
    case 5: // нижний левый
      return y < ctxH - 1 && x > 0 ? index + ctxW - 1 : -1
    case 6: // левый
      return x > 0 ? index - 1 : -1
    case 7: // верхний левый
      return y > 0 && x > 0 ? index - ctxW - 1 : -1
    default:
      return -1
  }
}

// function swapNeighboors(index: number, pattern: Uint8Array = new Uint8Array([1, 1, 1, 0, 0, 0, 0, 0])) {
//   const neighboors = findNeighboors(index)
//   for (let i = 0; i < pattern.length; i++) {
//     if (!pattern[i] || neighboors[i] === -1)
//       continue
//     currentCellArray.value[neighboors[i]] ^= 1
//   }
//   render()
// }

function handleCanvasClick(e: MouseEvent) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect)
    return
  const x = Math.floor(e.clientX - rect.left)
  const y = Math.floor(e.clientY - rect.top)
  const i = coorIndex({ x, y })

  // Рисуем Глайдер (5 точек)
  const glider = [1, ctxW + 2, ctxW * 2, ctxW * 2 + 1, ctxW * 2 + 2]
  glider.forEach((offset) => {
    if (i + offset < currentCellArray.value.length) {
      currentCellArray.value[i + offset] = 1
    }
  })

  render()
  if (!isRunning.value)
    toggleUpdate() // Запускаем цикл
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

function stopUpdate() {
  if (animationId.value !== null) {
    cancelAnimationFrame(animationId.value)
    animationId.value = null
  }
}

function handleRandom() {
  if (!isRunning.value) {
    toggleUpdate()
  }
  for (let i = 0; i < currentCellArray.value.length; i++) {
    currentCellArray.value[i] = Math.random() > 0.5 ? 1 : 0
  }
  render()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div>
        Клеточный автомат с большим числом клеток (~100 000)
      </div>
      <div>
        Цель: отрисовать тяжелую логику, предельно ее оптимизировав
      </div>
      <div>
        Результат: эээ
      </div>
    </div>
    <div class="flex flex-col gap-2 " :style="`max-width: ${ctxW}px;`">
      <div class="font-bold ">
        Холст
      </div>

      <div class="border border-primary-500 rounded-xl bg-black ">
        <canvas
          id="automataCanvas"
          ref="canvasRef"

          :width="ctxW"
          :height="ctxH"
          @click="handleCanvasClick"
        />
      </div>
      <div class="flex">
        <ElButton
          type="primary"
          class="w-full"
          @click="toggleUpdate()"
        >
          {{ isRunning ? 'Остановить' : 'Запустить' }}
        </ElButton>
        <ElButton
          class="w-full"
          type="primary"
          @click="handleClear"
        >
          Очистить
        </ElButton>
        <ElButton
          type="primary"
          class="w-full"
          @click="handleRandom"
        >
          Случайно
        </ElButton>
      </div>
    </div>
  </div>
</template>
