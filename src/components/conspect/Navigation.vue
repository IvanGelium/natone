<script setup lang="ts">
const props = defineProps<{
  chapters: {
    title: string
    pages: string[]
  }[]

  currentPage: string
}>()

const emit = defineEmits<{
  (e: 'changePage', chapterIndex: number, pageIndex: number): void
}>()

const { chapters, currentPage } = toRefs(props)
</script>

<template>
  <div class="flex flex-col overflow-auto">
    <div class="sticky z-10 p-4 text-sm uppercase rounded-t-2xl bg-primary-50 tracking-wide text-secondary border border-primary-200">
      Разделы
    </div>
    <aside class="overflow-scroll min-h-0 rounded-b-2xl border border-primary-200 bg-secondary p-4 shadow-sm">
      <div class="flex flex-col gap-4">
        <div v-for="(chapter, chapterIndex) in chapters" :key="`${chapterIndex}-${chapter.title}`" class="flex flex-col gap-2">
          <div class="flex gap-2 items-center">
            <div class="text-lg font-semibold">
              {{ chapter.title }}
            </div>
            -
            <div>
              {{ chapter.pages.length }}
            </div>
          </div>
          <div v-if="chapter.pages.length" class="flex flex-col gap-1">
            <button
              v-for="(page, pageIndex) in chapter.pages"
              :key="`${pageIndex}-${page}`"
              class="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-primary-100"
              :class="currentPage === page ? 'bg-primary-400 text-white hover:bg-primary-500' : 'text-secondary'"
              @click="emit('changePage', chapterIndex, pageIndex)"
            >
              {{ page }}
            </button>
          </div>
          <div v-else class="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-sm text-secondary">
            Материалы готовятся
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
