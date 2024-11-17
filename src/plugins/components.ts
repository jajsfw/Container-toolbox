import type { App } from 'vue'
import Message from '../components/Message.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorBoundary from '../components/ErrorBoundary.vue'
import GlobalLoading from '../components/GlobalLoading.vue'
import ProgressBar from '../components/ProgressBar.vue'

export function setupGlobalComponents(app: App) {
  app.component('Message', Message)
  app.component('LoadingSpinner', LoadingSpinner)
  app.component('LoadingState', LoadingState)
  app.component('ErrorBoundary', ErrorBoundary)
  app.component('GlobalLoading', GlobalLoading)
  app.component('ProgressBar', ProgressBar)
} 