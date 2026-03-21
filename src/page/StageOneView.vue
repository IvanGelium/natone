<script setup lang="ts">
import { pagesJs } from '../assets/conspect/one/js.ts'
import { pagesTs } from '../assets/conspect/one/ts.ts'
import Navigation from '../components/conspect/Navigation.vue'
import Page from '../components/conspect/Page.vue'
import Header from '../components/conspect/PageHeader.vue'
import { getDocUrl } from '../utils.ts'

const currentStage = {
  path: 'one',
}
const headerData = {
  header: 'Первый этап',
  description: 'Конспекты и практические задания по базовым технологиям.',
}

const mainToConspectPath = 'blob/main/src/assets/conspect'

const stageOne = [
  {
    title: 'JavaScript',
    path: 'js',
    pages: pagesJs,
  },
  {
    title: 'TypeScript',
    path: 'ts',
    pages: pagesTs,
  },
  {
    title: 'GIT',
    path: 'git',
    pages: [],
  },
]

const navData = stageOne.map(chap => ({
  title: chap.title,
  pages: chap.pages.map(page => page.title),
}),
)

const currentPageIndex = ref({ chapterIndex: 0, pageIndex: 0 })
const currentPage = computed(() => stageOne[currentPageIndex.value.chapterIndex].pages[currentPageIndex.value.pageIndex])

const currentLink = computed(() => {
  const chapter = stageOne[currentPageIndex.value.chapterIndex]
  const page = chapter.pages[currentPageIndex.value.pageIndex]
  return getDocUrl(`${mainToConspectPath}/${currentStage.path}/${chapter.path}/${page.path}/Practice.vue`)
})

onMounted(() => {
  const storaged = localStorage.getItem('currentPageIndex')
  if (!storaged) {
    currentPageIndex.value = { chapterIndex: 0, pageIndex: 0 }
  }
  else {
    currentPageIndex.value = JSON.parse(storaged)
  }
})
function handleChangePage(chapterIndex: number, pageIndex: number) {
  currentPageIndex.value = { chapterIndex, pageIndex }
  localStorage.setItem('currentPageIndex', JSON.stringify({ chapterIndex, pageIndex }))
}
</script>

<template>
  <div class="flex h-full flex-col gap-2">
    <Header
      :header="headerData.header"
      :description="headerData.description"
    />
    <div class="flex-1 min-h-0 grid gap-2 lg:grid-cols-[280px_1fr]">
      <Navigation
        :current-page="currentPage.title"
        :chapters="navData"
        @change-page="handleChangePage"
      />

      <main class="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-primary-200 bg-secondary shadow-sm">
        <div class="border-b border-primary-200 bg-primary-50 px-6 py-4">
          <div class="h-5 text-xl font-semibold">
            {{ currentPage.title }}
          </div>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto px-6 py-6">
          <Page :content="currentPage.content" :link="currentLink">
            <template v-if="currentPage.practice" #practice>
              <component :is="currentPage.practice" />
            </template>
          </Page>
        </div>
      </main>
    </div>
  </div>
</template>
