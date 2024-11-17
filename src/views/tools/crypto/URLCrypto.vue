<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          URL 编解码
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          支持 URL 编码和解码，包括中文字符
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- 模式切换 -->
        <div class="flex space-x-4">
          <button
            @click="mode = 'encode'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="mode === 'encode' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
          >
            编码
          </button>
          <button
            @click="mode = 'decode'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="mode === 'decode' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
          >
            解码
          </button>
        </div>

        <!-- 编码选项 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            编码方式
          </label>
          <select
            v-model="encodeType"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="standard">标准 URL 编码</option>
            <option value="component">URL 组件编码</option>
            <option value="all">编码所有字符</option>
          </select>
        </div>

        <!-- 输入文本 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ mode === 'encode' ? '待编码文本' : '待解码文本' }}
          </label>
          <textarea
            v-model="inputText"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            :placeholder="mode === 'encode' ? '请输入需要编码的文本' : '请输入需要解码的文本'"
          ></textarea>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-4">
          <button
            @click="clearText"
            class="btn-secondary"
          >
            清空
          </button>
          <button
            @click="process"
            class="btn"
            :disabled="!canProcess"
          >
            {{ mode === 'encode' ? '编码' : '解码' }}
          </button>
        </div>

        <!-- 结果显示 -->
        <div v-if="result" class="space-y-2">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ mode === 'encode' ? '编码结果' : '解码结果' }}
            </label>
            <button
              @click="copyResult"
              class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              复制结果
            </button>
          </div>
          <div class="relative">
            <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto max-h-60"><code>{{ result }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const mode = ref<'encode' | 'decode'>('encode')
const encodeType = ref<'standard' | 'component' | 'all'>('standard')
const inputText = ref('')
const result = ref('')

const canProcess = computed(() => inputText.value.trim() !== '')

const process = () => {
  try {
    if (mode.value === 'encode') {
      switch (encodeType.value) {
        case 'standard':
          result.value = encodeURI(inputText.value)
          break
        case 'component':
          result.value = encodeURIComponent(inputText.value)
          break
        case 'all':
          result.value = Array.from(inputText.value)
            .map(char => '%' + char.charCodeAt(0).toString(16).toUpperCase())
            .join('')
          break
      }
    } else {
      // 解码时自动检测编码方式
      try {
        result.value = decodeURIComponent(inputText.value)
      } catch {
        try {
          result.value = decodeURI(inputText.value)
        } catch {
          throw new Error('无效的编码格式')
        }
      }
    }
  } catch (error) {
    result.value = '处理失败：' + (error as Error).message
  }
}

const clearText = () => {
  inputText.value = ''
  result.value = ''
}

const copyResult = () => {
  navigator.clipboard.writeText(result.value)
}
</script> 