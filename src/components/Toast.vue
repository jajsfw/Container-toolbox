<template>
  <Transition name="toast">
    <div
      v-if="show"
      class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white"
      :class="[
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      ]"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
const message = ref('')
const type = ref<'success' | 'error'>('success')

const showToast = (msg: string, toastType: 'success' | 'error' = 'success') => {
  message.value = msg
  type.value = toastType
  show.value = true
  setTimeout(() => {
    show.value = false
  }, 3000)
}

defineExpose({
  showToast
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style> 