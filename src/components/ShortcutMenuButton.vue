<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed top-16 right-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-elevation-2 w-72"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
          快捷键
        </h3>
        <button
          @click="close"
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
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

      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="openSettings"
          class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          自定义快捷键
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defaultHotkeys } from '../types/settings'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isOpen', value: boolean): void
  (e: 'openSettings'): void
}>()

const shortcuts = defaultHotkeys

const close = () => {
  emit('update:isOpen', false)
}

const openSettings = () => {
  emit('openSettings')
  close()
}
</script> 