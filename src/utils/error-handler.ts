import type { App } from 'vue'

export function setupErrorHandler(app: App) {
  app.config.errorHandler = (err, instance, info) => {
    console.error('Global error:', err)
    console.error('Component:', instance)
    console.error('Error info:', info)
    
    // 这里可以添加错误上报逻辑
  }

  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason)
    // 这里可以添加错误上报逻辑
  })
} 