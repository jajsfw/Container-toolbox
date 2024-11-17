<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          JWT 解析
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          解析和验证 JWT Token，支持查看头部、载荷和签名
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- 输入区域 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            JWT Token
          </label>
          <textarea
            v-model="token"
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="请输入需要解析的 JWT Token..."
          ></textarea>
        </div>

        <!-- 解析结果 -->
        <div v-if="parsedToken" class="space-y-6">
          <!-- 头部 -->
          <div>
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                头部 (Header)
              </h4>
              <button
                @click="copyPart('header')"
                class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                复制
              </button>
            </div>
            <pre class="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto"><code class="text-sm">{{ formatJSON(parsedToken.header) }}</code></pre>
          </div>

          <!-- 载荷 -->
          <div>
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                载荷 (Payload)
              </h4>
              <button
                @click="copyPart('payload')"
                class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                复制
              </button>
            </div>
            <pre class="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto"><code class="text-sm">{{ formatJSON(parsedToken.payload) }}</code></pre>
            
            <!-- 过期时间提示 -->
            <div v-if="parsedToken.payload.exp" class="mt-2">
              <div class="flex items-center space-x-2">
                <span class="text-sm" :class="isExpired ? 'text-red-500' : 'text-green-500'">
                  {{ isExpired ? '已过期' : '未过期' }}
                </span>
                <span class="text-sm text-gray-500">
                  过期时间: {{ formatDate(parsedToken.payload.exp) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 签名 -->
          <div>
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
                签名 (Signature)
              </h4>
              <button
                @click="copyPart('signature')"
                class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                复制
              </button>
            </div>
            <pre class="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto"><code class="text-sm break-all">{{ parsedToken.signature }}</code></pre>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="text-sm text-red-500">
          {{ error }}
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-4">
          <button
            @click="clearToken"
            class="btn-secondary"
          >
            清空
          </button>
          <button
            @click="parseToken"
            class="btn"
            :disabled="!token"
          >
            解析
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ParsedToken {
  header: any
  payload: any
  signature: string
}

const token = ref('')
const parsedToken = ref<ParsedToken | null>(null)
const error = ref('')

// 检查是否过期
const isExpired = computed(() => {
  if (!parsedToken.value?.payload.exp) return false
  return Date.now() >= parsedToken.value.payload.exp * 1000
})

// 解析 Token
const parseToken = () => {
  try {
    error.value = ''
    const parts = token.value.split('.')
    if (parts.length !== 3) {
      throw new Error('无效的 JWT Token 格式')
    }

    parsedToken.value = {
      header: JSON.parse(atob(parts[0])),
      payload: JSON.parse(atob(parts[1])),
      signature: parts[2]
    }
  } catch (err) {
    error.value = (err as Error).message
    parsedToken.value = null
  }
}

// 格式化 JSON
const formatJSON = (obj: any) => {
  return JSON.stringify(obj, null, 2)
}

// 格式化日期
const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString()
}

// 复制部分内容
const copyPart = (part: 'header' | 'payload' | 'signature') => {
  if (!parsedToken.value) return

  let content = ''
  switch (part) {
    case 'header':
      content = formatJSON(parsedToken.value.header)
      break
    case 'payload':
      content = formatJSON(parsedToken.value.payload)
      break
    case 'signature':
      content = parsedToken.value.signature
      break
  }

  navigator.clipboard.writeText(content)
}

// 清空输入
const clearToken = () => {
  token.value = ''
  parsedToken.value = null
  error.value = ''
}
</script> 