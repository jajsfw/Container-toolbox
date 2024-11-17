<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          正则表达式测试
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          测试和验证正则表达式，支持实时匹配
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- 正则表达式输入 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            正则表达式
          </label>
          <div class="mt-1 flex rounded-md shadow-sm">
            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
              /
            </span>
            <input
              type="text"
              v-model="pattern"
              class="flex-1 min-w-0 block w-full px-3 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 dark:text-gray-100"
              placeholder="输入正则表达式..."
            >
            <span class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
              /
              <input
                type="text"
                v-model="flags"
                class="w-12 ml-1 bg-transparent border-0 focus:ring-0 p-0 text-gray-500 dark:text-gray-400"
                placeholder="flags"
              >
            </span>
          </div>
        </div>

        <!-- 测试文本 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            测试文本
          </label>
          <textarea
            v-model="testText"
            rows="6"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="输入需要测试的文本..."
          ></textarea>
        </div>

        <!-- 匹配结果 -->
        <div v-if="pattern">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              匹配结果
            </h4>
            <div class="text-sm text-gray-500">
              找到 {{ matches.length }} 个匹配
            </div>
          </div>

          <!-- 匹配列表 -->
          <div v-if="matches.length > 0" class="mt-2 space-y-2">
            <div
              v-for="(match, index) in matches"
              :key="index"
              class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  匹配 #{{ index + 1 }}
                </span>
                <span class="text-sm text-gray-500">
                  位置: {{ match.index }}
                </span>
              </div>
              <pre class="mt-2 text-sm text-gray-900 dark:text-gray-100"><code>{{ match.text }}</code></pre>
              
              <!-- 捕获组 -->
              <div v-if="match.groups.length > 0" class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  捕获组
                </div>
                <div class="space-y-1">
                  <div
                    v-for="(group, groupIndex) in match.groups"
                    :key="groupIndex"
                    class="text-sm"
                  >
                    <span class="text-gray-500">组 {{ groupIndex }}: </span>
                    <code class="text-gray-900 dark:text-gray-100">{{ group }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 无匹配提示 -->
          <div v-else class="mt-2 text-sm text-gray-500">
            没有找到匹配项
          </div>
        </div>

        <!-- 常用正则表达式 -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            常用正则表达式
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              v-for="regex in commonRegexes"
              :key="regex.pattern"
              @click="useCommonRegex(regex)"
              class="text-left p-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div class="font-medium text-gray-900 dark:text-gray-100">
                {{ regex.name }}
              </div>
              <div class="text-gray-500 font-mono">
                {{ regex.pattern }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface RegexMatch {
  text: string
  index: number
  groups: string[]
}

const pattern = ref('')
const flags = ref('g')
const testText = ref('')
const matches = ref<RegexMatch[]>([])

const commonRegexes = [
  {
    name: '邮箱地址',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'g'
  },
  {
    name: '手机号码',
    pattern: '1[3-9]\\d{9}',
    flags: 'g'
  },
  {
    name: 'URL',
    pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+[\\w\\-\\.,@?^=%&:/~\\+#]*',
    flags: 'g'
  },
  {
    name: '日期 (YYYY-MM-DD)',
    pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])',
    flags: 'g'
  },
  {
    name: 'IP 地址',
    pattern: '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)',
    flags: 'g'
  },
  {
    name: '中文字符',
    pattern: '[\\u4e00-\\u9fa5]',
    flags: 'g'
  }
]

// 使用常用正则表达式
const useCommonRegex = (regex: { pattern: string; flags: string }) => {
  pattern.value = regex.pattern
  flags.value = regex.flags
}

// 执行正则匹配
const executeRegex = () => {
  matches.value = []
  if (!pattern.value || !testText.value) return

  try {
    const regex = new RegExp(pattern.value, flags.value)
    let match: RegExpExecArray | null

    if (flags.value.includes('g')) {
      while ((match = regex.exec(testText.value)) !== null) {
        matches.value.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1)
        })
      }
    } else if ((match = regex.exec(testText.value)) !== null) {
      matches.value.push({
        text: match[0],
        index: match.index,
        groups: match.slice(1)
      })
    }
  } catch (error) {
    console.error('Invalid regex:', error)
  }
}

// 监听输入变化
watch([pattern, flags, testText], executeRegex)
</script> 