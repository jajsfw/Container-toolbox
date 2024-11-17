<template>
  <div class="flex flex-col items-center justify-center py-12">
    <LoadingSpinner :size="48" class="text-blue-500" />
    <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">{{ message || '加载中...' }}</p>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'

defineProps<{
  message?: string
}>()
</script> 