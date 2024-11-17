<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          密码生成器
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          生成安全的随机密码，支持自定义规则
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- 生成的密码 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            生成的密码
          </label>
          <div class="mt-1 relative">
            <input
              type="text"
              v-model="generatedPassword"
              readonly
              class="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
            <button
              @click="copyPassword"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 密码设置 -->
        <div class="space-y-4">
          <!-- 密码长度 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              密码长度: {{ length }}
            </label>
            <input
              type="range"
              v-model.number="length"
              min="4"
              max="64"
              class="mt-1 block w-full"
            >
          </div>

          <!-- 字符类型 -->
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="uppercase"
                v-model="options.uppercase"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
              >
              <label for="uppercase" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                大写字母 (A-Z)
              </label>
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="lowercase"
                v-model="options.lowercase"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
              >
              <label for="lowercase" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                小写字母 (a-z)
              </label>
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="numbers"
                v-model="options.numbers"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
              >
              <label for="numbers" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                数字 (0-9)
              </label>
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                id="symbols"
                v-model="options.symbols"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
              >
              <label for="symbols" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                特殊字符 (!@#$%^&*)
              </label>
            </div>
          </div>

          <!-- 自定义字符 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              自定义字符
            </label>
            <input
              type="text"
              v-model="customChars"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              placeholder="添加自定义字符..."
            >
          </div>

          <!-- 排除相似字符 -->
          <div class="flex items-center">
            <input
              type="checkbox"
              id="excludeSimilar"
              v-model="options.excludeSimilar"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
            >
            <label for="excludeSimilar" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              排除相似字符 (1, l, I, 0, O, o)
            </label>
          </div>
        </div>

        <!-- 密码强度指示器 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              密码强度
            </label>
            <span class="text-sm" :class="strengthColor">
              {{ strengthText }}
            </span>
          </div>
          <div class="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
            <div
              class="h-full transition-all duration-300"
              :class="strengthColor"
              :style="{ width: `${strengthScore * 25}%` }"
            ></div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-4">
          <button
            @click="generatePassword"
            class="btn"
            :disabled="!canGenerate"
          >
            生成密码
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface PasswordOptions {
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
  excludeSimilar: boolean
}

const length = ref(16)
const options = ref<PasswordOptions>({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false
})
const customChars = ref('')
const generatedPassword = ref('')

// 字符集
const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*',
  similar: '1lI0Oo'
}

// 检查是否可以生成密码
const canGenerate = computed(() => {
  return options.value.uppercase || 
         options.value.lowercase || 
         options.value.numbers || 
         options.value.symbols ||
         customChars.value.length > 0
})

// 获取可用字符集
const getAvailableChars = () => {
  let chars = ''
  if (options.value.uppercase) chars += charSets.uppercase
  if (options.value.lowercase) chars += charSets.lowercase
  if (options.value.numbers) chars += charSets.numbers
  if (options.value.symbols) chars += charSets.symbols
  if (customChars.value) chars += customChars.value

  if (options.value.excludeSimilar) {
    chars = chars.split('').filter(char => !charSets.similar.includes(char)).join('')
  }

  return chars
}

// 生成密码
const generatePassword = () => {
  const chars = getAvailableChars()
  if (!chars) return

  let password = ''
  const array = new Uint32Array(length.value)
  crypto.getRandomValues(array)

  for (let i = 0; i < length.value; i++) {
    password += chars[array[i] % chars.length]
  }

  generatedPassword.value = password
}

// 复制密码
const copyPassword = () => {
  if (!generatedPassword.value) return
  navigator.clipboard.writeText(generatedPassword.value)
}

// 计算密码强度
const strengthScore = computed(() => {
  if (!generatedPassword.value) return 0
  let score = 0

  // 长度得分
  if (length.value >= 12) score++
  if (length.value >= 16) score++

  // 字符类型得分
  const hasUpper = /[A-Z]/.test(generatedPassword.value)
  const hasLower = /[a-z]/.test(generatedPassword.value)
  const hasNumber = /[0-9]/.test(generatedPassword.value)
  const hasSymbol = /[!@#$%^&*]/.test(generatedPassword.value)

  if (hasUpper && hasLower) score++
  if (hasNumber) score++
  if (hasSymbol) score++

  return score
})

// 密码强度文本
const strengthText = computed(() => {
  switch (strengthScore.value) {
    case 0: return '非常弱'
    case 1: return '弱'
    case 2: return '中等'
    case 3: return '强'
    case 4: return '非常强'
    default: return ''
  }
})

// 密码强度颜色
const strengthColor = computed(() => {
  switch (strengthScore.value) {
    case 0: return 'text-red-500 bg-red-500'
    case 1: return 'text-orange-500 bg-orange-500'
    case 2: return 'text-yellow-500 bg-yellow-500'
    case 3: return 'text-green-500 bg-green-500'
    case 4: return 'text-blue-500 bg-blue-500'
    default: return ''
  }
})

// 初始生成一个密码
generatePassword()
</script> 