import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { setupErrorHandler } from './utils/error-handler'
import { setupGlobalComponents } from './plugins/components'
import './assets/main.css'

// 创建应用实例
const app = createApp(App)

// 创建 pinia 实例
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 注册插件
app.use(pinia)
app.use(router)

// 设置全局组件
setupGlobalComponents(app)

// 设置错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component:', instance)
  console.error('Error info:', info)
}

// 挂载应用
app.mount('#app') 