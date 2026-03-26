<script setup>
import MarkdownIt from 'markdown-it'
import { createHighlighter } from 'shiki'
import { onMounted, ref, watch } from 'vue'
import 'github-markdown-css/github-markdown.css'

const props = defineProps(['content'])
const renderedHtml = ref('')
async function initMarkdown() {
  const highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: ['javascript', 'vue', 'html', 'css', 'console', 'bash'],
  })

  const md = new MarkdownIt({
    html: true,
    highlight: (code, lang) => {
      return highlighter.codeToHtml(code, {
        lang: lang || 'text',
        theme: 'github-dark',
      })
    },
  })

  renderedHtml.value = md.render(props.content)
}

onMounted(initMarkdown)
watch(() => props.content, initMarkdown)
</script>

<template>
  <div class="markdown-body bg-secondary! text-(--text-primary)!" v-html="renderedHtml" />
</template>

<style scoped>
.markdown-body :deep(pre) {
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}
</style>
