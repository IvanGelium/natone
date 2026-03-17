<script setup lang="ts">
import { pagesJs } from '../assets/conspect/one/js.ts'
import { pagesTs } from '../assets/conspect/one/ts.ts'
import Page from '../components/conspect/Page.vue'

const stageOne = [
  {
    title: 'JavaScript',
    pages: pagesJs,
  },
  {
    title: 'TypeScript',
    pages: pagesTs,
  },
  {
    title: 'GIT',
    pages: [],
  },
]

const currentPage = ref(stageOne[0].pages[0])
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <div class="rounded-xl bg-primary p-2 flex gap-4">
      <p class="text-2xl">
        Первый этап
      </p>
    </div>
    <div class=" rounded-xl flex gap-2 h-full overflow-auto">
      <div class="bg-primary min-w-50 p-2 rounded-xl flex flex-col gap-2">
        <div v-for="(chapter, index) in stageOne" :key="`${index}-${chapter.title}`">
          <div class="p-1 rounded-xl text-xl">
            {{ chapter.title }}
          </div>
          <div v-for="(page, pageIndex) in chapter.pages" :key="`${pageIndex}-${page.title}`">
            <div
              class="pl-2 pr-1 py-1 hover:bg-(--primary-100) cursor-pointer rounded"
              :class="`${currentPage.title === page.title ? 'bg-(--primary-400) hover:bg-(--primary-500) text-white' : ''}`"
              @click="currentPage = page"
            >
              - {{ page.title }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex bg-primary w-full">
        <!-- <div
          class="flex items-center justify-center bg-primary min-h-full min-w-8  rounded-l-xl"
          :class="currentPage <= 1 ? 'cursor-no-drop' : 'cursor-pointer hover:bg-(--secondary-200)'"
          @click="handleChangePage('prev')"
        >
          {{ '<' }}
        </div> -->
        <div class="overflow-y-scroll p-4 w-full">
          <Page :content="currentPage.content.replace('##', '###')" :link="currentPage.gitHubLink">
            <template v-if="currentPage.practice" #practice>
              <component :is="currentPage.practice" />
            </template>
          </Page>
        </div>
        <!-- <div
          class="flex items-center justify-center bg-primary min-h-full min-w-8 rounded-r-xl"
          :class="currentPage >= allPages.length ? 'cursor-no-drop' : 'cursor-pointer hover:bg-(--secondary-200)'"
          @click="handleChangePage('next')"
        >
          {{ '>' }}
        </div> -->
      </div>
    </div>
  </div>
</template>
