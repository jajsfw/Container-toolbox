<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          Unicode 编解码
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          支持 Unicode 转义序列和字符之间的转换
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
            编码格式
          </label>
          <select
            v-model="format"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="\\u">Unicode (\\u)</option>
            <option value="\\x">十六进制 (\\x)</option>
            <option value="&#">HTML 实体 (&#)</option>
            <option value="%u">URL Unicode (%u)</option>
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
          <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto"><code>{{ result }}</code></pre>
        </div>

        <!-- 字符信息 -->
        <div v-if="charInfo.length > 0" class="space-y-2">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
            字符信息
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="(info, index) in charInfo"
              :key="index"
              class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div class="text-2xl mb-2">{{ info.char }}</div>
              <div class="space-y-1 text-sm">
                <div class="text-gray-500">Unicode: {{ info.unicode }}</div>
                <div class="text-gray-500">UTF-16: {{ info.utf16 }}</div>
                <div class="text-gray-500">UTF-8: {{ info.utf8 }}</div>
                <div class="text-gray-500">HTML: {{ info.html }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const mode = ref<'encode' | 'decode'>('encode')
const format = ref('\\u')
const inputText = ref('')
const result = ref('')

const canProcess = computed(() => inputText.value.trim() !== '')

// 编码处理
const encode = () => {
  let encoded = ''
  for (let i = 0; i < inputText.value.length; i++) {
    const char = inputText.value.charAt(i)
    const code = char.charCodeAt(0)
    
    switch (format.value) {
      case '\\u':
        encoded += '\\u' + code.toString(16).padStart(4, '0')
        break
      case '\\x':
        encoded += '\\x' + code.toString(16).padStart(2, '0')
        break
      case '&#':
        encoded += '&#' + code + ';'
        break
      case '%u':
        encoded += '%u' + code.toString(16).padStart(4, '0')
        break
    }
  }
  result.value = encoded
}

// 解码处理
const decode = () => {
  try {
    let decoded = ''
    const text = inputText.value

    if (format.value === '\\u') {
      decoded = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => 
        String.fromCharCode(parseInt(hex, 16))
      )
    } else if (format.value === '\\x') {
      decoded = text.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      )
    } else if (format.value === '&#') {
      decoded = text.replace(/&#(\d+);/g, (_, dec) =>
        String.fromCharCode(parseInt(dec, 10))
      )
    } else if (format.value === '%u') {
      decoded = text.replace(/%u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      )
    }

    result.value = decoded
  } catch (err) {
    result.value = '解码失败：' + (err as Error).message
  }
}

// 获取字符信息
const charInfo = computed(() => {
  if (!result.value) return []

  return Array.from(result.value).map(char => {
    const code = char.charCodeAt(0)
    return {
      char,
      unicode: '\\u' + code.toString(16).padStart(4, '0'),
      utf16: '0x' + code.toString(16).padStart(4, '0'),
      utf8: Array.from(new TextEncoder().encode(char))
        .map(b => '0x' + b.toString(16).padStart(2, '0'))
        .join(' '),
      html: '&#' + code + ';'
    }
  })
})

// 处理文本
const process = () => {
  if (mode.value === 'encode') {
    encode()
  } else {
    decode()
  }
}

// 清空文本
const clearText = () => {
  inputText.value = ''
  result.value = ''
}

// 复制结果
const copyResult = () => {
  navigator.clipboard.writeText(result.value)
}
</script> 