import * as ElementPlusIconsVue from '@element-plus/icons-vue' // Добавьте этот импорт
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router.js'
import './style.css'
import './styles/var.css'
import 'element-plus/dist/index.css'
import './styles/element-theme.css'

const app = createApp(App) // Сохраняем ссылку на приложение

// Регистрируем все иконки
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$getDocUrl = (path) => {
  return `${import.meta.env.VITE_GITHUB_REPO_URL}/${path}`
}

app.use(router)
  .use(ElementPlus)
  .mount('#app')
