<template>
  <div v-if="error" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3 w-0 flex-1">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            发生错误
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ error.message }}
            </p>
          </div>
          <div class="mt-4 flex gap-2">
            <button
              type="button"
              class="btn-secondary"
              @click="reload"
            >
              刷新页面
            </button>
            <button
              type="button"
              class="btn"
              @click="reset"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const error = ref<Error | null>(null)

const reload = () => {
  window.location.reload()
}

const reset = () => {
  error.value = null
}

const handleError = (err: Error) => {
  error.value = err
}

defineExpose({
  handleError
})
</script> 