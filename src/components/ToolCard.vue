<template>
  <div class="h-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-elevation-1 hover:shadow-elevation-2 dark:shadow-elevation-1-dark dark:hover:shadow-elevation-2-dark transition-all duration-200 overflow-hidden relative">
    <!-- 背景渐变 -->
    <div class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-200">
      <div :class="[
        'w-full h-full transform scale-150',
        tool.gradientColor
      ]"></div>
    </div>

    <div class="relative">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div :class="[
            'h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
            tool.gradientColor
          ]">
            <component :is="tool.icon" class="h-6 w-6 text-white" />
          </div>
        </div>
        <div class="ml-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {{ tool.name }}
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ tool.description }}
          </p>
        </div>
      </div>
      
      <!-- 功能标签 -->
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in tool.tags"
          :key="tag"
          class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tool } from '../types/tool'

defineProps<{
  tool: Tool
}>()
</script> 