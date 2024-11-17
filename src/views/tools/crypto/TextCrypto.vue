<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          文本加密解密
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          支持多种加密算法，包括 AES、DES、3DES 等
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- 模式选择 -->
        <div class="flex space-x-4">
          <button
            @click="mode = 'encrypt'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="mode === 'encrypt' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
          >
            加密
          </button>
          <button
            @click="mode = 'decrypt'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="mode === 'decrypt' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
          >
            解密
          </button>
        </div>

        <!-- 加密设置 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              加密算法
            </label>
            <select
              v-model="algorithm"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="AES">AES</option>
              <option value="DES">DES</option>
              <option value="TripleDES">3DES</option>
              <option value="RC4">RC4</option>
              <option value="Rabbit">Rabbit</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              密钥
            </label>
            <input
              type="text"
              v-model="key"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              placeholder="请输入密钥"
            >
          </div>
        </div>

        <!-- 输入文本 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ mode === 'encrypt' ? '待加密文本' : '待解密文本' }}
          </label>
          <textarea
            v-model="inputText"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            :placeholder="mode === 'encrypt' ? '请输入需要加密的文本' : '请输入需要解密的文本'"
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
            @click="processText"
            class="btn"
            :disabled="!canProcess"
          >
            {{ mode === 'encrypt' ? '加密' : '解密' }}
          </button>
        </div>

        <!-- 结果显示 -->
        <div v-if="outputText" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ mode === 'encrypt' ? '加密结果' : '解密结果' }}
          </label>
          <div class="relative">
            <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto"><code>{{ outputText }}</code></pre>
            <button
              @click="copyResult"
              class="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CryptoJS from 'crypto-js'

const mode = ref<'encrypt' | 'decrypt'>('encrypt')
const algorithm = ref('AES')
const key = ref('')
const inputText = ref('')
const outputText = ref('')

const canProcess = computed(() => {
  return inputText.value && key.value
})

const processText = () => {
  try {
    if (mode.value === 'encrypt') {
      encrypt()
    } else {
      decrypt()
    }
  } catch (error) {
    outputText.value = '处理失败：' + (error as Error).message
  }
}

const encrypt = () => {
  let result: string
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.value)
  const textUtf8 = CryptoJS.enc.Utf8.parse(inputText.value)

  switch (algorithm.value) {
    case 'AES':
      result = CryptoJS.AES.encrypt(textUtf8, keyUtf8, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString()
      break
    case 'DES':
      result = CryptoJS.DES.encrypt(textUtf8, keyUtf8, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString()
      break
    case 'TripleDES':
      result = CryptoJS.TripleDES.encrypt(textUtf8, keyUtf8, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString()
      break
    case 'RC4':
      result = CryptoJS.RC4.encrypt(textUtf8, keyUtf8).toString()
      break
    case 'Rabbit':
      result = CryptoJS.Rabbit.encrypt(textUtf8, keyUtf8).toString()
      break
    default:
      throw new Error('不支持的加密算法')
  }

  outputText.value = result
}

const decrypt = () => {
  let result: string
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key.value)

  try {
    switch (algorithm.value) {
      case 'AES':
        result = CryptoJS.AES.decrypt(inputText.value, keyUtf8, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
        break
      case 'DES':
        result = CryptoJS.DES.decrypt(inputText.value, keyUtf8, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
        break
      case 'TripleDES':
        result = CryptoJS.TripleDES.decrypt(inputText.value, keyUtf8, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
        break
      case 'RC4':
        result = CryptoJS.RC4.decrypt(inputText.value, keyUtf8).toString(CryptoJS.enc.Utf8)
        break
      case 'Rabbit':
        result = CryptoJS.Rabbit.decrypt(inputText.value, keyUtf8).toString(CryptoJS.enc.Utf8)
        break
      default:
        throw new Error('不支持的解密算法')
    }

    if (!result) {
      throw new Error('解密失败，请检查密钥是否正确')
    }

    outputText.value = result
  } catch (error) {
    throw new Error('解密失败，请检查密钥和密文格式是否正确')
  }
}

const clearText = () => {
  inputText.value = ''
  outputText.value = ''
}

const copyResult = () => {
  navigator.clipboard.writeText(outputText.value)
}
</script> 