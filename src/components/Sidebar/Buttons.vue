<script setup lang="ts">
import { ArrowRight, Film, House, IceCream, QuartzWatch, ZoomIn } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'

const props = defineProps<{
  isSideBarOpen: boolean
}>()
const emit = defineEmits<{
  (e: 'changeSideBar'): void
}>()
const { isSideBarOpen } = toRefs(props)
const buttons = [
  {
    name: 'home',
    label: 'Главная',
    icon: House,
    route: '/',
    isReady: true,
  },
  {
    name: 'stage-one',
    label: 'Первый этап',
    icon: Film,
    route: '/stage-one',
    isReady: true,
  },
  {
    name: 'stage-two',
    label: 'Второй этап',
    icon: ZoomIn,
    route: '/stage-two',
    isReady: false,
  },
  {
    name: 'stage-three',
    label: 'Третий этап',
    icon: QuartzWatch,
    route: '/stage-three',
    isReady: false,
  },
  {
    name: 'stage-four',
    label: 'Четвертый этап',
    icon: IceCream,
    route: '/stage-four',
    isReady: false,
  },
]

function handleArrowClick() {
  emit('changeSideBar')
}

const primaryButton = ref<typeof buttons[number]['route']> (window.location.pathname)
function handleNavigateButtonClick(button: typeof buttons[number]['route']) {
  primaryButton.value = button
}
</script>

<template>
  <div class="flex flex-col overflow-hidden">
    <div class="flex flex-col gap-2">
      <div v-for="(button, index) in buttons" :key="`${index}-${button.label}`">
        <div v-if="!isSideBarOpen">
          <RouterLink :to="button.route">
            <ElButton
              class="min-w-full min-h-12"
              :disabled="button.isReady ? false : true"
              :icon="button.icon"
              :type="primaryButton === button.route ? 'primary' : 'default'"
              @click="handleNavigateButtonClick(button.route)"
            />
          </RouterLink>
        </div>
        <div v-if="isSideBarOpen">
          <RouterLink :to="button.route">
            <ElButton
              class="min-w-full min-h-12 flex gap-2"
              :disabled="button.isReady ? false : true"
              :icon="button.icon"
              :type="primaryButton === button.route ? 'primary' : 'default'"
              @click="handleNavigateButtonClick(button.route)"
            >
              {{ button.label }}
            </ElButton>
          </RouterLink>
        </div>
      </div>
      <div class="flex  h-full">
        <div v-if="!isSideBarOpen" class="w-full">
          <ElButton
            class="w-full min-h-12"
            :icon="ArrowRight"
            @click="handleArrowClick"
          />
        </div>
        <div v-if="isSideBarOpen" class="w-full">
          <ElButton
            class="w-full min-h-12"
            :icon="ArrowRight"
            @click="handleArrowClick"
          >
            Свернуть
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>
