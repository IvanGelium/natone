<script setup lang="ts">
import { Loading } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'
import { useDebounce } from '@/utils'
import { fishtext } from './fishtext'

interface WordTopEntry {
  word: string
  count: number
}

interface WordsProcentege {
  short: number
  medium: number
  long: number
}

interface TextAnalyse {
  sentenceCount: number
  avgSentenceLength: number
  wordsCount: number
  uniqWordsCount: number
  wordTop: WordTopEntry[]
  wordLengthProcentege: WordsProcentege
  avgWordLength: number

}

const { debounced: debouncedHandleChange, isDebouncing } = useDebounce(handleChange, 1000)

const regexSymbols = /[^\p{L}\p{N}\s]/gu
const regexSpaces = /\s+/
const sentenceRegex = /[.!?]+(?=\s|$)/g

const currentText = ref('')
const analyse = ref<TextAnalyse | null>(null)
function handleChange(): void {
  const txt = currentText.value
  if (!txt) {
    analyse.value = null
    return
  }
  const STOP_WORDS = new Set(['в', 'и', 'на', 'с', 'по', 'а', 'о', 'бы'])

  const sentenseArray = txt.replace(',', ' ').split(sentenceRegex).filter(w => w.trim())
  const sentenceCount = sentenseArray.length
  const avgSentenceLength
    = Math
      .round(sentenseArray
        .reduce((acc, sentence) => acc + sentence
          .split(' ')
          .filter(w => w.trim() && !STOP_WORDS.has(w))
          .length, 0)
        / sentenseArray.length)

  const wordsArray = txt
    .toLowerCase()
    .replace(regexSymbols, ' ')
    .split(regexSpaces)
    .filter(w => w && !STOP_WORDS.has(w))

  const wordsCount = wordsArray.length

  const wordsSet = new Set(wordsArray)
  const uniqWordsCount = wordsSet.size

  const wordFrequencies = new Map<string, number>()
  wordsArray.forEach((word) => {
    const count = wordFrequencies.get(word) || 0
    wordFrequencies.set(word, count + 1)
  })

  const wordTop = Array.from(wordFrequencies.entries(), ([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  const wc = wordsArray.reduce((acc, val) => {
    const vl = val.length
    if (vl < 4)
      acc.short++
    if (vl > 3 && vl < 8)
      acc.medium++
    if (vl > 7)
      acc.long++
    return acc
  }, {
    short: 0,
    medium: 0,
    long: 0,
  })

  const total = wc.long + wc.medium + wc.short
  const wordLengthProcentege = {
    long: wc.long / total,
    medium: wc.medium / total,
    short: wc.short / total,
  }

  const avgWordLength = Math.round(wordsArray.reduce((acc, val) => acc + val.length, 0) / wordsArray.length)

  analyse.value = {
    sentenceCount,
    avgSentenceLength,
    wordsCount,
    uniqWordsCount,
    wordTop,
    wordLengthProcentege,
    avgWordLength,
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <div>
        Анализатор текста, который демонстрирует основные подходы
        при обработке коллекций
      </div>
      <div>
        Цель: на примере работы с длинным текстом, показать как работают методы коллекций.
      </div>
      <div>
        Результат: компонент при расчете статистики использует все виды коллекций и многие методы для работы с ними
      </div>
    </div>
    <div class="flex gap-8">
      <div class="flex flex-col gap-2">
        <div class="font-bold">
          Окно для ввода текста
        </div>
        <div class="min-w-100 bg-primary-100">
          <el-input
            v-model="currentText"
            type="textarea"
            placeholder="Введите текст для анализа"
            :autosize="{ minRows: 10, maxRows: 15 }"
            @input="debouncedHandleChange"
          />
        </div>
        <ElButton
          type="primary"
          @click="() => {
            currentText = fishtext
            handleChange()
          }"
        >
          Подставить текст-рыбу
        </ElButton>
      </div>
      <div class="flex flex-col gap-2">
        <div class="font-bold flex gap-2 items-center">
          <p> Анализ текста</p><Loading v-if="isDebouncing" class="h-5 animate-spin" />
        </div>

        <div class="flex flex-col gap-2 min-w-100 min-h-10 bg-primary-100 rounded-xl border border-primary-200">
          <div v-if="analyse" class="p-2 flex flex-col gap-2">
            <div class="flex gap-2 items-center">
              <p class="text-sm">
                Количество предложений:
              </p>
              <p class="text-primary-500">
                {{ analyse.sentenceCount }}
              </p>
            </div>
            <div class="flex gap-2 items-center">
              <p class="text-sm">
                Средняя длина предложения:
              </p>
              <p class="text-primary-500">
                {{ analyse.avgSentenceLength }}
              </p>
            </div>
            <div class="flex gap-2 items-center">
              <p class="text-sm">
                Общее количество слов:
              </p>
              <p class="text-primary-500">
                {{ analyse.wordsCount }}
              </p>
            </div>
            <div class="flex gap-2 items-center">
              <p class="text-sm">
                Количество уникальных слов:
              </p>
              <p class="text-primary-500">
                {{ analyse.uniqWordsCount }}
              </p>
            </div>
            <div class="flex gap-2 items-center">
              <p class="text-sm">
                Креативность текста:
              </p>
              <p class="text-primary-500">
                {{ Math.round(analyse.uniqWordsCount / analyse.wordsCount * 100) }}%
              </p>
            </div>
            <div class="flex gap-2 items-center">
              <p class="text-sm">
                Средняя длина слова:
              </p>
              <p class="text-primary-500">
                {{ analyse.avgWordLength }}
              </p>
            </div>
            <div class="flex gap-2 flex-col">
              <p class="text-sm">
                Топ самых частых слов:
              </p>
              <div>
                <div v-for="(val, index) in analyse.wordTop" :key="`word-top-${index}`">
                  <div class="ml-4 flex gap-2">
                    <p class="text-sm">
                      {{ val.word.charAt(0).toUpperCase() + val.word.slice(1).toLowerCase() }}:
                    </p>
                    <p class="text-primary-500">
                      {{ val.count }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex gap-2 flex-col">
              <p class="text-sm">
                Процентное распределение по длине слов:
              </p>
              <div class="ml-4">
                <div v-for="(val, key) in analyse.wordLengthProcentege" :key="key">
                  <div class="flex gap-2">
                    <p class="text-sm">
                      {{ key === 'long' ? 'Длинные' : key === 'medium' ? 'Средние' : 'Короткие' }}
                    </p>
                    <p class="text-primary-500">
                      {{ Math.round(val * 100) }}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="p-4">
            Введите текст...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
