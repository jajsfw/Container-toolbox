<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div class="flex flex-col items-center">
        <LoadingSpinner :size="48" class="text-blue-500" />
        <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">{{ message }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const show = ref(false)
const message = ref('加载中...')

const start = (msg = '加载中...') => {
  message.value = msg
  show.value = true
}

const stop = () => {
  show.value = false
}

defineExpose({
  start,
  stop
})
</script> 