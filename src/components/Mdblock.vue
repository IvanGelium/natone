<script setup>
import MarkdownIt from 'markdown-it'
import { createHighlighter } from 'shiki'
import { onMounted, ref, watch } from 'vue'
import 'github-markdown-css/github-markdown.css' // или github-markdown.css для светлой

const props = defineProps(['content'])
const renderedHtml = ref('')

// Инициализируем Shiki (движок подсветки)
async function initMarkdown() {
  const highlighter = await createHighlighter({
    themes: ['github-dark'], // Тема как в VS Code
    langs: ['javascript', 'vue', 'html', 'css'], // Языки, которые нужны в конспекте
  })

  const md = new MarkdownIt({
    html: true, // Разрешаем HTML внутри MD
    highlight: (code, lang) => {
      // Shiki генерирует готовый HTML с inline-стилями
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
  <!-- Директива v-html вставит отрендеренный конспект -->
  <div class="markdown-body bg-primary! text-(--text-primary)!" v-html="renderedHtml" />
</template>

<style scoped>
/* Стили для блоков кода, чтобы они выглядели аккуратно */
.markdown-body :deep(pre) {
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}
</style>
