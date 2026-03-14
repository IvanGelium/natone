import { createRouter, createWebHistory } from 'vue-router'

import HomeView from './page/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/stage-one', component: HomeView },
  { path: '/stage-two', component: HomeView },
  { path: '/stage-three', component: HomeView },
  { path: '/stage-four', component: HomeView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
