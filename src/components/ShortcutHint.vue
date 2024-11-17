<template>
  <div class="fixed bottom-4 left-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <div class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
      快捷键
    </div>
    <div class="space-y-2">
      <div v-for="shortcut in shortcuts" :key="shortcut.key" class="flex items-center text-sm">
        <div class="flex items-center space-x-1">
          <template v-if="shortcut.ctrl">
            <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600">
              ctrl
            </kbd>
            <span class="text-gray-500">+</span>
          </template>
          <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600">
            {{ shortcut.key }}
          </kbd>
        </div>
        <span class="ml-2 text-gray-500 dark:text-gray-400">{{ shortcut.description }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defaultHotkeys } from '@/types/settings'

const shortcuts = defaultHotkeys
</script> 