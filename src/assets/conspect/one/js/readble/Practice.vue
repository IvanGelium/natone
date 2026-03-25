<script setup lang="ts">
import type { FakeProject, FakeUser } from '@/types/utils'
import { StarFilled } from '@element-plus/icons-vue'
import { ElButton } from 'element-plus'
import { FakeData, fakeFetch, useDebounce } from '@/utils'

// #region Получение данных

const _fake = new FakeData(50)

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

// #endregion

// #region Обработка данных

interface UserGroup {
  title: string
  users: FakeUser[]
}
type GroupTypes = 'byActive' | 'byRole' | 'byNothing'

const groupes = [
  {
    label: 'Не группировать',
    value: 'byNothing',
  },
  {
    label: 'По активным',
    value: 'byActive',
  },
  {
    label: 'По роли',
    value: 'byRole',
  },
]
const groupingStrategy = ref<GroupTypes>('byNothing')

const td = computed(() => {
  const header = [{ id: 0, title: '.' }, ...fakeProjects.value]
  const group = groupUsers(fakeUsers.value)
  const prepareRow = (user: FakeUser) => [
    user.name,
    ...fakeProjects.value.map(p => user.projectId.includes(p.id)),
  ]

  const groupedRows = group.map(g => ({
    title: g.title,
    users: g.users.map(prepareRow),
  }))

  return { header, groupedRows }
})

function groupUsers(users: FakeUser[]): UserGroup[] {
  switch (groupingStrategy.value) {
    case 'byActive':
      return [
        {
          title: 'Активные',
          users: users.filter(u => u.isActive),
        },
        {
          title: 'Не активные',
          users: users.filter(u => !u.isActive),
        },
      ]
    case 'byRole':
      return [
        {
          title: 'Админ',
          users: users.filter(u => u.role === 'admin'),
        },
        {
          title: 'Пользователь',
          users: users.filter(u => u.role === 'user'),
        },
        {
          title: 'Гость',
          users: users.filter(u => u.role === 'guest'),
        },
      ]
    case 'byNothing':
      return [{
        title: 'Без группировки',
        users,
      }]
    default:
      return []
  }
}

// #endregion
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <div>Полный процесс работы с данными, от их получения, до обработки и отображения на странице</div>
      <div>Цель: отобразить реалестичный процесс работы с внешними данными</div>
      <div>Результат: в компоненте пройден полный путь: запрос, распоковка и обработка данных</div>
    </div>
    <div>
      <ElButton
        type="primary"
        :loading="isFetching"
        @click="debouncedHandleClick"
      >
        Получить данные пользователей
      </ElButton>
    </div>
    <div class="bg-primary-50 max-h-200 rounded-xl border border-primary-500 overflow-auto scroll-smooth">
      <div v-if="isVisible && !isError">
        <div class="sticky top-0 z-10 flex border border-primary-500 bg-primary-300   rounded-t-xl w-fit items-center">
          <div v-for="(col, colIndex) in td.header" :key="`col-${col.id}`">
            <div class="p-2 flex justify-center" :class="colIndex === 0 ? 'min-w-50 max-w-50' : 'min-w-30 max-w-30'">
              <p v-if="colIndex" class="font-bold">
                {{ col.title }}
              </p>
              <el-select v-else v-model="groupingStrategy">
                <el-option
                  v-for="(opt, optIndex) in groupes"
                  :key="`${opt.value}-${optIndex}`"
                  :value="opt.value"
                  :label="opt.label"
                />
              </el-select>
            </div>
          </div>
        </div>
        <div class="w-fit">
          <div v-for="(group, index) in td.groupedRows" :key="`group-${index}`">
            <div
              class="font-bold min-h-10 bg-primary-200 w-full cursor-pointer"
            >
              <p class="p-2">
                {{ group.title }}
              </p>
            </div>
            <div class="w-fit">
              <div v-for="(row, rowIndex) in group.users" :key="`row-${rowIndex}`">
                <div :class="rowIndex % 2 !== 0 ? 'bg-primary-100' : ''" class="flex hover:bg-primary-500 hover:text-white w-fit">
                  <div v-for="(cell, cellIndex) in row" :key="`cell-${rowIndex}-${cellIndex}`">
                    <div :class="cellIndex === 0 ? 'min-w-50 max-w-50' : 'min-w-30 max-w-30'" class="h-full border border-primary-200 min-h-10">
                      <p v-if="typeof cell === 'string'" class="p-2">
                        {{ cell }}
                      </p>
                      <p v-else-if="typeof cell === 'boolean' && cell" class="p-2 flex justify-center items-center">
                        <StarFilled class="max-w-5" />
                      </p>
                      <p v-else />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="isError" class="p-2 bg-primary-300">
        {{ isError }}
      </div>
      <div v-else class="p-2 bg-primary-300">
        Запросите данные...
      </div>
    </div>
  </div>
</template>
