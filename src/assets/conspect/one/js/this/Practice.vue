<script setup lang="ts">
interface Boundaries {
  top: number
  left: number
}
interface Coordinates {
  x: number
  y: number
}

const fieldRef = ref<null | Element>(null)
const circleRefs = ref<null | NodeListOf<HTMLElement>>(null)
const handlers = ref(new Map<HTMLElement, (this: HTMLElement) => Promise<void>>())
onMounted(() => {
  fieldRef.value = document.querySelector('#fld')
  if (!fieldRef.value) {
    return
  }
  const fieldRect = fieldRef.value.getBoundingClientRect()
  circleRefs.value = document.querySelectorAll('.rnd')
  if (!circleRefs.value) {
    return
  }

  for (const circleRef of circleRefs.value) {
    if (!circleRef) {
      continue
    }

    const circleRect = circleRef.getBoundingClientRect()
    const boundries = {
      top: fieldRect.height - circleRect.height,
      left: fieldRect.width - circleRect.width,
    }

    const randomTop = Math.floor(Math.random() * boundries.top)
    const randomLeft = Math.floor(Math.random() * boundries.left)
    circleRef.style.top = `${randomTop}px`
    circleRef.style.left = `${randomLeft}px`
    const handler = useHandleEnter(boundries)
    circleRef.addEventListener('mouseenter', handler)
    handlers.value.set(circleRef, handler)
  }
})

function useHandleEnter(boundries: Boundaries) {
  let isMoving = false
  return async function (this: HTMLElement) {
    if (isMoving === true) {
      return
    }
    isMoving = true
    const times = Math.floor(Math.random() * 50)
    await moveElXTimes(this, times, boundries)
    isMoving = false
  }
}

async function moveElXTimes(el: HTMLElement, times: number, boundries: Boundaries) {
  for (let c = 0; c < times; c++) {
    const start = { x: el.offsetLeft, y: el.offsetTop }
    const end = {
      x: Math.floor(Math.random() * boundries.left),
      y: Math.floor(Math.random() * boundries.top),
    }

    await animateMove(el, start, end, 500)
  }
}

async function animateMove(element: HTMLElement, start: Coordinates, end: Coordinates, duration = 1000) {
  return new Promise((resolve) => {
    const startTime = performance.now()
    const direction = Math.floor(Math.random() * 2 + 1)
    const control = {
      x: (start.x + end.x) / 2 + (Math.random() * 100 - 50),
      y: Math.min(start.y, end.y) + (direction > 1 ? -150 : 150),
    }

    function step(currentTime: number) {
      let elapsed = (currentTime - startTime) / duration
      if (elapsed > 1)
        elapsed = 1

      const t = elapsed * elapsed * (3 - 2 * elapsed)
      const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x
      const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y

      element.style.left = `${x}px`
      element.style.top = `${y}px`

      if (elapsed < 1) {
        requestAnimationFrame(step)
      }
      else {
        resolve(true)
      }
    }
    requestAnimationFrame(step)
  })
}

onUnmounted(() => {
  if (circleRefs.value) {
    for (const circleRef of circleRefs.value) {
      const handler = handlers.value.get(circleRef)
      if (handler) {
        circleRef.removeEventListener('mouseenter', handler)
      }
    }
  }
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div>
      Пример использования this для обработки события.
    </div>
    <div>
      Цель: используя нативные методы браузера для управления элементами,
      сделать анимацию движения при касание элемента
    </div>
    <div>
      Результат: когда мы используем addEventListener, он передает
      в колбэк this, который указывает на элемент от которого вызван ивент.
      Благодаря чему мы можем управлять любым элементом на который мы вешаем данный обработчик.
    </div>

    <div
      id="fld" class="relative border-2 rounded-xl border-primary-500 min-w-1/2 min-h-100"
    >
      <div
        class="rnd w-8 h-8 bg-primary-600 rounded-full absolute"
      />
      <div
        class="rnd w-10 h-10 bg-green-600 rounded-full absolute"
      />
      <div
        class="rnd w-5 h-5 bg-red-600 rounded-full absolute"
      />
    </div>
  </div>
</template>
