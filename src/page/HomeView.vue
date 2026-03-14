<script setup lang="ts">
import { ElButton } from 'element-plus'
import { pages } from '../assets/conspect/one/js.ts'
import Page from '../components/conspect/Page.vue'

const currentPage = ref(1)
function handleChangePage(change: 'next' | 'prev') {
  const max = pages.length
  switch (change) {
    case `next`:
      if (currentPage.value >= max)
        break
      currentPage.value++
      break
    case 'prev':
      if (currentPage.value <= 1)
        break
      currentPage.value--
      break
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 pr-4">
    <div class="rounded-xl bg-primary p-2 flex gap-4">
      <p class="text-2xl">
        Первый этап
      </p>
      <div class="flex justify-between gap-2">
        <ElButton
          :disabled="currentPage <= 1 ? true : false"
          @click="handleChangePage('prev')"
        >
          {{ `<` }}
        </ElButton>
        <div class="bg-white p-1 rounded-l">
          {{ `${currentPage}/${pages.length}` }}
        </div>
        <ElButton
          :disabled="currentPage >= pages.length ? true : false"
          @click="handleChangePage('next')"
        >
          {{ `>` }}
        </ElButton>
      </div>
    </div>
    <div class="bg-primary p-2 rounded-xl flex flex-col gap-4">
      <Page :content="pages[currentPage - 1].content">
        <template #practice>
          <component :is="pages[currentPage - 1].practice" />
        </template>
      </Page>
    </div>
  </div>
</template>
