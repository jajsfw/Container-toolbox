<template>
  <div class="relative max-w-2xl mx-auto">
    <div class="flex items-center h-12 rounded-full bg-white dark:bg-gray-800 shadow-elevation-1 focus-within:shadow-elevation-2 transition-shadow">
      <div class="pl-4">
        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        class="w-full h-full px-4 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder-gray-500"
      >
      <div v-if="modelValue" class="pr-4">
        <button
          @click="$emit('update:modelValue', '')"
          class="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script> 