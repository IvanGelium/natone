import { createRouter, createWebHistory } from 'vue-router'

import HomeView from './page/HomeView.vue'
import StageOneView from './page/StageOneView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/stage-one', component: StageOneView },
  { path: '/stage-two', component: HomeView },
  { path: '/stage-three', component: HomeView },
  { path: '/stage-four', component: HomeView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
