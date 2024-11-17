<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          Base64 编解码
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          支持文本和文件的 Base64 编码和解码
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

        <!-- 类型选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            输入类型
          </label>
          <div class="mt-2 flex space-x-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="inputType"
                value="text"
                class="form-radio text-blue-600"
              >
              <span class="ml-2 text-gray-700 dark:text-gray-300">文本</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="inputType"
                value="file"
                class="form-radio text-blue-600"
              >
              <span class="ml-2 text-gray-700 dark:text-gray-300">文件</span>
            </label>
          </div>
        </div>

        <!-- 文本输入 -->
        <div v-if="inputType === 'text'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ mode === 'encode' ? '待编码文本' : '待解码文本' }}
          </label>
          <textarea
            v-model="inputText"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            :placeholder="mode === 'encode' ? '请输入需要编码的文本' : '请输入需要解码的 Base64 字符串'"
          ></textarea>
        </div>

        <!-- 文件输入 -->
        <div v-else>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            选择文件
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md dark:border-gray-600">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600 dark:text-gray-400">
                <label class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500">
                  <span>选择文件</span>
                  <input type="file" class="sr-only" @change="handleFileSelect">
                </label>
                <p class="pl-1">或拖拽文件到这里</p>
              </div>
              <p class="text-xs text-gray-500">
                支持任意类型文件
              </p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-4">
          <button
            @click="clearInput"
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
          <div v-if="inputType === 'text'" class="relative">
            <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto max-h-60"><code>{{ result }}</code></pre>
          </div>
          <div v-else class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <span class="text-sm text-gray-900 dark:text-gray-100">
              {{ mode === 'encode' ? 'Base64 字符串已生成' : '文件已解码' }}
            </span>
            <button
              @click="downloadResult"
              class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              下载文件
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const mode = ref<'encode' | 'decode'>('encode')
const inputType = ref<'text' | 'file'>('text')
const inputText = ref('')
const selectedFile = ref<File | null>(null)
const result = ref('')

const canProcess = computed(() => {
  if (inputType.value === 'text') {
    return inputText.value.trim() !== ''
  }
  return selectedFile.value !== null
})

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  selectedFile.value = input.files[0]
}

// 处理文本编解码
const processText = () => {
  try {
    if (mode.value === 'encode') {
      result.value = btoa(inputText.value)
    } else {
      result.value = atob(inputText.value)
    }
  } catch (error) {
    result.value = '处理失败：' + (error as Error).message
  }
}

// 处理文件编解码
const processFile = async () => {
  if (!selectedFile.value && inputType.value === 'file') return

  try {
    if (mode.value === 'encode') {
      // 编码文件为 Base64
      const buffer = await selectedFile.value!.arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let binary = ''
      bytes.forEach(byte => binary += String.fromCharCode(byte))
      result.value = btoa(binary)
    } else {
      // 解码 Base64 为文件
      try {
        const binaryString = atob(inputText.value)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes.buffer])
        result.value = URL.createObjectURL(blob)
      } catch (error) {
        throw new Error('Base64 格式不正确')
      }
    }
  } catch (error) {
    result.value = '处理失败：' + (error as Error).message
  }
}

// 处理编解码
const process = () => {
  if (inputType.value === 'text') {
    processText()
  } else {
    processFile()
  }
}

// 清空输入
const clearInput = () => {
  inputText.value = ''
  selectedFile.value = null
  if (result.value && mode.value === 'decode') {
    URL.revokeObjectURL(result.value)
  }
  result.value = ''
}

// 复制结果
const copyResult = () => {
  navigator.clipboard.writeText(result.value)
}

// 下载结果
const downloadResult = () => {
  if (!result.value) return

  const link = document.createElement('a')
  if (mode.value === 'encode') {
    // 下载 Base64 文本
    const blob = new Blob([result.value], { type: 'text/plain' })
    link.href = URL.createObjectURL(blob)
    link.download = 'encoded.txt'
  } else {
    // 下载解码后的文件
    link.href = result.value
    // 尝试保留原始文件扩展名
    const originalName = selectedFile.value?.name || 'decoded_file'
    const extension = originalName.split('.').pop()
    link.download = extension ? `decoded.${extension}` : 'decoded_file'
  }
  link.click()

  // 清理 URL 对象
  if (mode.value === 'decode') {
    URL.revokeObjectURL(result.value)
  }
}
</script> 