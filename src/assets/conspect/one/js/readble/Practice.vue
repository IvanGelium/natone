<script setup lang="ts">
import type { FakeProject, FakeUser } from '@/types/utils'
import { ElButton } from 'element-plus'
import { FakeData, fakeFetch, useDebounce } from '@/utils'

const _fake = new FakeData(20)

type FakeGetUsersApiResonseMessage = FakeUser[]
type FakeGetProjectsApiResonseMessage = FakeProject[]

const fakeUsers = ref<FakeUser[]>([])
const fakeProjects = ref<FakeProject[]>([])
const isFetching = ref(false)
const isVisible = computed(() => fakeUsers.value.length && fakeProjects.value.length)
const isError = ref('')
async function processResponse<T>(responsePromise: Promise<Response>): Promise<T> {
  const res = await responsePromise
  if (!res.ok) {
    const errorBody = await res.json()
    console.error('Ошибка API:', errorBody)
    throw new Error(errorBody.message || 'Ошибка запроса')
  }
  return await res.json()
}

function getUsers() {
  const apiResponse = fakeFetch('/api/users', {
    returnData: _fake.users,
    shouldFail: false,
  })

  return processResponse<FakeGetUsersApiResonseMessage>(apiResponse)
}

function getProjects() {
  const apiResponse = fakeFetch('/api/projects', {
    returnData: _fake.projects,
    shouldFail: false,
  })
  return processResponse<FakeGetProjectsApiResonseMessage>(apiResponse)
}

function handleClick() {
  isFetching.value = true
  Promise.all([getUsers(), getProjects()])
    .then((data) => {
      fakeUsers.value = data[0]
      fakeProjects.value = data[1]
      isFetching.value = false
    })
    .catch((err) => {
      fakeUsers.value = []
      fakeProjects.value = []
      isError.value = err
    })
}

const {
  debounced: debouncedHandleClick,
}
  = useDebounce(handleClick, 500, { immediate: true })
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div>Полный процесс работы с данными, от их получения, до обработки и отображения на странице</div>
      <div>Цель: отобразить реалестичный процесс работы с внешними данными</div>
      <div>Результат: в компоненте пройден полный путь от запроса, получения до обработки данных</div>
    </div>
    <div>
      <ElButton
        type="primary"
        :loading="isFetching"
        :disabled="isFetching"
        @click="debouncedHandleClick"
      >
        Получить данные пользователей
      </ElButton>
    </div>
    <div v-if="isVisible && !isError">
      <div v-for="user in fakeUsers" :key="user.id">
        {{ user }}
      </div>
      <div v-for="project in fakeProjects" :key="`${project.id}-project`">
        {{ project }}
      </div>
    </div>
    <div v-if="isError">
      {{ isError }}
    </div>
  </div>
</template>
