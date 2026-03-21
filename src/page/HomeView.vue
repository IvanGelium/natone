<script setup lang="ts">
import { getDocUrl } from '../utils'
</script>

<template>
  <div class="relative min-h-full overflow-hidden rounded-xl bg-primary px-6 py-10 text-primary md:px-10">
    <div class="relative mx-auto flex max-w-6xl flex-col gap-10">
      <div class="grid gap-8 lg:grid-cols-12 lg:items-center">
        <div class="lg:col-span-7">
          <div class="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-secondary px-3 py-1 text-sm text-secondary">
            <span class="h-2 w-2 rounded-full bg-primary-500" />
            Практика
          </div>
          <h1 class="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            Основы Frontend разработки
          </h1>
          <p class="mt-4 text-lg text-secondary">
            Это учебный проект нацеленный на практику разработки на фронтенде.
          </p>
          <a :href="getDocUrl('')" target="_blank" rel="noopener noreferrer">
            <div class="mt-6 text-sm text-secondary flex gap-2 items-center">
              <div
                class="rounded-full flex gap-2 border border-primary-200 bg-secondary px-3 py-1"
              >
                <img class="w-5 h-5" src="../assets/github.svg" alt="gh-logo">
                <p class="font-bold">GitHub</p>
              </div>
            </div>
          </a>
        </div>
        <div class="lg:col-span-5">
          <div class="rounded-2xl border border-primary-200 bg-secondary p-6 shadow-md">
            <div class="text-sm uppercase tracking-wide text-secondary">
              Как устроено
            </div>
            <div class="mt-3 text-2xl font-semibold">
              1 проект = 4 этапа
            </div>
            <p class="mt-3 text-secondary">
              Каждый этап разбит на технологии. Внутри — конспекты и практические задания.
            </p>
            <div class="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div class="rounded-xl border border-primary-200 bg-primary-50 p-4">
                <div class="text-secondary">
                  Цель
                </div>
                <div class="mt-2 text-lg font-semibold">
                  Улучшение базы по фронту
                </div>
              </div>
              <div class="rounded-xl border border-primary-200 bg-primary-50 p-4">
                <div class="text-secondary">
                  Фокус
                </div>
                <div class="mt-2 text-lg font-semibold">
                  Более глубокое понимание
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-primary-200 bg-secondary/70 p-6 shadow-sm">
        <div class="text-lg font-semibold">
          Структура этапов
        </div>
        <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-xl border border-primary-200 bg-primary-50 p-5">
            <div class="text-sm text-secondary">
              Этап 1
            </div>
            <div class="mt-2 text-xl font-semibold">
              Базовые технологии
            </div>
            <p class="mt-3 text-sm text-secondary">
              JavaScript и TypeScript, а также работа с GIT
            </p>
          </div>
          <div class="rounded-xl border border-primary-200 bg-primary-50 p-5">
            <div class="text-sm text-secondary">
              Этап 2
            </div>
            <div class="mt-2 text-xl font-semibold">
              Vue + Nuxt
            </div>
            <p class="mt-3 text-sm text-secondary">
              Реактивность, серверный рендеринг и разделение UI от логики
            </p>
          </div>
          <div class="rounded-xl border border-primary-200 bg-primary-50 p-5">
            <div class="text-sm text-secondary">
              Этап 3
            </div>
            <div class="mt-2 text-xl font-semibold">
              API и безопасность
            </div>
            <p class="mt-3 text-sm text-secondary">
              Написание API клиента и основы безопасного фронтенда
            </p>
          </div>
          <div class="rounded-xl border border-primary-200 bg-primary-50 p-5">
            <div class="text-sm text-secondary">
              Этап 4
            </div>
            <div class="mt-2 text-xl font-semibold">
              Архитектура и оптимизация
            </div>
            <p class="mt-3 text-sm text-secondary">
              Паттерны разработки, поддерживаемость кода и решения для оптимизации
            </p>
          </div>
        </div>
      </div>

      <!-- <div class="grid gap-6 lg:grid-cols-3">
        <div class="rounded-2xl border border-primary-200 bg-secondary p-6 shadow-sm">
          <div class="text-sm uppercase tracking-wide text-secondary">
            Сейчас
          </div>
          <div class="mt-2 text-2xl font-semibold">
            Этап 1 в работе
          </div>
          <p class="mt-3 text-secondary">
            Внутри конспекты и практические задания. План: собрать первую полноценную страницу и адаптировать её.
          </p>
        </div>
        <div class="rounded-2xl border border-primary-200 bg-secondary p-6 shadow-sm">
          <div class="text-sm uppercase tracking-wide text-secondary">
            Цель
          </div>
          <div class="mt-2 text-2xl font-semibold">
            Портфолио-проект
          </div>
          <p class="mt-3 text-secondary">
            Финальный результат — аккуратное приложение, которое можно показать на собеседовании.
          </p>
        </div>
        <div class="rounded-2xl border border-primary-200 bg-secondary p-6 shadow-sm">
          <div class="text-sm uppercase tracking-wide text-secondary">
            Формат
          </div>
          <div class="mt-2 text-2xl font-semibold">
            Короткие спринты
          </div>
          <p class="mt-3 text-secondary">
            Каждая тема завершается мини-проектом: так прогресс виден и измерим.
          </p>
        </div>
      </div> -->
    </div>
  </div>
</template>
