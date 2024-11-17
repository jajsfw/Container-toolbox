<template>
  <TransitionGroup
    tag="div"
    name="notification"
    class="fixed top-4 right-4 z-50 space-y-2"
  >
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="flex items-center p-4 rounded-lg shadow-lg text-white transform transition-all duration-300"
      :class="[
        notification.type === 'success' ? 'bg-green-500' :
        notification.type === 'error' ? 'bg-red-500' :
        notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
      ]"
    >
      <!-- 图标 -->
      <div class="flex-shrink-0">
        <svg v-if="notification.type === 'success'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="notification.type === 'error'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      
      <!-- 消息内容 -->
      <div class="ml-3">
        <p class="text-sm font-medium">
          {{ notification.message }}
        </p>
      </div>
      
      <!-- 关闭按钮 -->
      <div class="ml-4">
        <button
          class="inline-flex text-white focus:outline-none hover:text-white/80"
          @click="removeNotification(notification.id)"
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

interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

const notifications = ref<Notification[]>([])
let nextId = 1

const addNotification = (message: string, type: Notification['type'] = 'info') => {
  const id = nextId++
  notifications.value.push({ id, message, type })
  setTimeout(() => removeNotification(id), 5000)
}

const removeNotification = (id: number) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

defineExpose({
  addNotification
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 