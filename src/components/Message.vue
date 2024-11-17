<template>
  <TransitionGroup
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-x-full opacity-0"
    enter-to-class="transform translate-x-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-x-0 opacity-100"
    leave-to-class="transform translate-x-full opacity-0"
  >
    <div
      v-for="msg in messages"
      :key="msg.id"
      :class="[
        'flex items-center p-4 rounded-lg shadow-lg text-white transform transition-all duration-300',
        msg.type === 'success' ? 'bg-green-500' :
        msg.type === 'error' ? 'bg-red-500' :
        msg.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
      ]"
    >
      <!-- 图标 -->
      <div class="flex-shrink-0">
        <svg v-if="msg.type === 'success'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="msg.type === 'error'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="msg.type === 'warning'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </div>
      
      <!-- 消息内容 -->
      <div class="ml-3">
        <p class="text-sm font-medium">
          {{ msg.content }}
        </p>
      </div>
      
      <!-- 关闭按钮 -->
      <div class="ml-4">
        <button
          class="inline-flex text-white focus:outline-none hover:text-white/80"
          @click="removeMessage(msg.id)"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  content: string
}

const messages = ref<Message[]>([])
let nextId = 1

const show = (content: string, type: Message['type'] = 'info', duration = 3000) => {
  const id = nextId++
  messages.value.push({ id, content, type })
  if (duration > 0) {
    setTimeout(() => removeMessage(id), duration)
  }
}

const removeMessage = (id: number) => {
  const index = messages.value.findIndex(msg => msg.id === id)
  if (index > -1) {
    messages.value.splice(index, 1)
  }
}

defineExpose({
  success: (content: string, duration?: number) => show(content, 'success', duration),
  error: (content: string, duration?: number) => show(content, 'error', duration),
  warning: (content: string, duration?: number) => show(content, 'warning', duration),
  info: (content: string, duration?: number) => show(content, 'info', duration)
})
</script> 