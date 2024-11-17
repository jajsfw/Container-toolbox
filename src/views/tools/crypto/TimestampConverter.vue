<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          时间戳转换
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          在时间戳和日期时间之间转换，支持多种格式
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- 当前时间 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              当前时间
            </label>
            <button
              @click="copyCurrentTimestamp"
              class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              复制时间戳
            </button>
          </div>
          <div class="mt-1 grid grid-cols-2 gap-4">
            <div class="text-sm text-gray-900 dark:text-gray-100">
              {{ currentDateTime }}
            </div>
            <div class="text-sm text-gray-500">
              {{ currentTimestamp }}
            </div>
          </div>
        </div>

        <!-- 时间戳转日期时间 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            时间戳转日期时间
          </label>
          <div class="mt-1 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="col-span-2">
                <input
                  type="text"
                  v-model="timestampInput"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="输入时间戳..."
                >
              </div>
              <select
                v-model="timestampUnit"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="s">秒</option>
                <option value="ms">毫秒</option>
              </select>
            </div>
            <div v-if="timestampResult" class="text-sm text-gray-900 dark:text-gray-100">
              {{ timestampResult }}
            </div>
            <div v-else-if="timestampError" class="text-sm text-red-500">
              {{ timestampError }}
            </div>
          </div>
        </div>

        <!-- 日期时间转时间戳 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            日期时间转时间戳
          </label>
          <div class="mt-1 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="datetime-local"
                v-model="dateTimeInput"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
              <select
                v-model="dateTimeUnit"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="s">秒</option>
                <option value="ms">毫秒</option>
              </select>
            </div>
            <div v-if="dateTimeResult" class="text-sm text-gray-900 dark:text-gray-100">
              {{ dateTimeResult }}
            </div>
          </div>
        </div>

        <!-- 常用时间戳 -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            常用时间戳
          </h4>
          <div class="space-y-2">
            <div
              v-for="(timestamp, label) in commonTimestamps"
              :key="label"
              class="flex items-center justify-between text-sm"
            >
              <span class="text-gray-700 dark:text-gray-300">{{ label }}</span>
              <div class="flex items-center space-x-2">
                <span class="text-gray-500">{{ timestamp }}</span>
                <button
                  @click="copyTimestamp(timestamp)"
                  class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  复制
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 当前时间相关
const currentDateTime = ref('')
const currentTimestamp = ref('')

const updateCurrentTime = () => {
  const now = new Date()
  currentDateTime.value = now.toLocaleString()
  currentTimestamp.value = Math.floor(now.getTime() / 1000).toString()
}

// 时间戳转日期时间
const timestampInput = ref('')
const timestampUnit = ref<'s' | 'ms'>('s')
const timestampError = ref('')

const timestampResult = computed(() => {
  if (!timestampInput.value) return ''

  try {
    const timestamp = parseInt(timestampInput.value)
    if (isNaN(timestamp)) throw new Error('无效的时间戳')

    const date = new Date(timestampUnit.value === 's' ? timestamp * 1000 : timestamp)
    if (date.toString() === 'Invalid Date') throw new Error('无效的时间戳')

    timestampError.value = ''
    return date.toLocaleString()
  } catch (err) {
    timestampError.value = (err as Error).message
    return ''
  }
})

// 日期时间转时间戳
const dateTimeInput = ref('')
const dateTimeUnit = ref<'s' | 'ms'>('s')

const dateTimeResult = computed(() => {
  if (!dateTimeInput.value) return ''

  const date = new Date(dateTimeInput.value)
  const timestamp = date.getTime()
  return dateTimeUnit.value === 's' ? Math.floor(timestamp / 1000) : timestamp
})

// 常用时间戳
const commonTimestamps = computed(() => {
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000
  
  return {
    '一天前': Math.floor((now - oneDay) / 1000),
    '一周前': Math.floor((now - 7 * oneDay) / 1000),
    '一个月前': Math.floor((now - 30 * oneDay) / 1000),
    '一年前': Math.floor((now - 365 * oneDay) / 1000),
    '一天后': Math.floor((now + oneDay) / 1000),
    '一周后': Math.floor((now + 7 * oneDay) / 1000),
    '一个月后': Math.floor((now + 30 * oneDay) / 1000),
    '一年后': Math.floor((now + 365 * oneDay) / 1000)
  }
})

// 复制功能
const copyCurrentTimestamp = () => {
  navigator.clipboard.writeText(currentTimestamp.value)
}

const copyTimestamp = (timestamp: number) => {
  navigator.clipboard.writeText(timestamp.toString())
}

// 初始化
onMounted(() => {
  updateCurrentTime()
  // 每秒更新当前时间
  setInterval(updateCurrentTime, 1000)

  // 设置默认日期时间输入为当前时间
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  dateTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`
})
</script> 