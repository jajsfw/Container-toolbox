<template>
  <div class="fixed top-0 left-0 right-0 z-50">
    <div
      class="h-0.5 bg-blue-500 transition-all duration-300"
      :style="{ width: `${progress}%`, opacity: show ? 1 : 0 }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const show = ref(false)
const progress = ref(0)

const start = () => {
  show.value = true
  progress.value = 0
  simulateProgress()
}

const finish = () => {
  progress.value = 100
  setTimeout(() => {
    show.value = false
    progress.value = 0
  }, 300)
}

const simulateProgress = () => {
  const interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 10
    } else {
      clearInterval(interval)
    }
  }, 200)
}

defineExpose({
  start,
  finish
})
</script> 