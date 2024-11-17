<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <!-- 工具标题 -->
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          哈希计算
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          计算文本或文件的哈希值，支持MD5、SHA1、SHA256等
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- 输入类型选择 -->
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
            输入文本
          </label>
          <textarea
            v-model="inputText"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="请输入需要计算哈希的文本..."
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

        <!-- 哈希算法选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            哈希算法
          </label>
          <div class="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <label 
              v-for="algo in algorithms" 
              :key="algo.value"
              class="inline-flex items-center"
            >
              <input
                type="checkbox"
                v-model="selectedAlgorithms"
                :value="algo.value"
                class="form-checkbox text-blue-600"
              >
              <span class="ml-2 text-gray-700 dark:text-gray-300">{{ algo.name }}</span>
            </label>
          </div>
        </div>

        <!-- 计算按钮 -->
        <div class="flex justify-end">
          <button
            @click="calculateHash"
            class="btn"
            :disabled="!canCalculate"
          >
            计算哈希值
          </button>
        </div>

        <!-- 计算结果 -->
        <div v-if="results.length > 0" class="space-y-4">
          <div 
            v-for="result in results" 
            :key="result.algorithm"
            class="bg-gray-50 dark:bg-gray-900 p-4 rounded-md"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ result.algorithm.toUpperCase() }}
              </span>
              <button
                @click="copyToClipboard(result.hash)"
                class="text-blue-600 hover:text-blue-500 text-sm"
              >
                复制
              </button>
            </div>
            <div class="mt-1 font-mono text-sm text-gray-600 dark:text-gray-400 break-all">
              {{ result.hash }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CryptoJS from 'crypto-js'

const inputType = ref<'text' | 'file'>('text')
const inputText = ref('')
const selectedFile = ref<File | null>(null)
const selectedAlgorithms = ref<string[]>(['md5'])

const algorithms = [
  { name: 'MD5', value: 'md5' },
  { name: 'SHA1', value: 'sha1' },
  { name: 'SHA256', value: 'sha256' },
  { name: 'SHA512', value: 'sha512' },
  { name: 'RIPEMD160', value: 'ripemd160' },
]

const results = ref<Array<{ algorithm: string, hash: string }>>([])

const canCalculate = computed(() => {
  return (inputType.value === 'text' && inputText.value) ||
         (inputType.value === 'file' && selectedFile.value)
})

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    selectedFile.value = input.files[0]
  }
}

const calculateHash = async () => {
  results.value = []
  
  if (inputType.value === 'text') {
    selectedAlgorithms.value.forEach(algo => {
      let hash = ''
      switch (algo) {
        case 'md5':
          hash = CryptoJS.MD5(inputText.value).toString()
          break
        case 'sha1':
          hash = CryptoJS.SHA1(inputText.value).toString()
          break
        case 'sha256':
          hash = CryptoJS.SHA256(inputText.value).toString()
          break
        case 'sha512':
          hash = CryptoJS.SHA512(inputText.value).toString()
          break
        case 'ripemd160':
          hash = CryptoJS.RIPEMD160(inputText.value).toString()
          break
      }
      results.value.push({ algorithm: algo, hash })
    })
  } else if (selectedFile.value) {
    // 实现文件哈希计算
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as ArrayBuffer
      const wordArray = CryptoJS.lib.WordArray.create(content)
      
      selectedAlgorithms.value.forEach(algo => {
        let hash = ''
        switch (algo) {
          case 'md5':
            hash = CryptoJS.MD5(wordArray).toString()
            break
          case 'sha1':
            hash = CryptoJS.SHA1(wordArray).toString()
            break
          case 'sha256':
            hash = CryptoJS.SHA256(wordArray).toString()
            break
          case 'sha512':
            hash = CryptoJS.SHA512(wordArray).toString()
            break
          case 'ripemd160':
            hash = CryptoJS.RIPEMD160(wordArray).toString()
            break
        }
        results.value.push({ algorithm: algo, hash })
      })
    }
    reader.readAsArrayBuffer(selectedFile.value)
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  // 可以添加复制成功提示
}
</script> 