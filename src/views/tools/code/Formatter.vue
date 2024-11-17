<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <!-- 工具标题 -->
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          代码格式化
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          支持HTML、CSS、JavaScript等多种语言的代码格式化
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- 语言选择 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            编程语言
          </label>
          <select 
            v-model="language"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <!-- 代码输入 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            输入代码
          </label>
          <div class="mt-1">
            <textarea
              v-model="inputCode"
              rows="8"
              class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              placeholder="在此粘贴需要格式化的代码..."
            ></textarea>
          </div>
        </div>

        <!-- 格式化选项 -->
        <div class="space-y-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">格式化选项</h4>
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="options.semicolons"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
              >
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">添加分号</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="options.singleQuote"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600"
              >
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">使用单引号</span>
            </label>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-4">
          <button
            @click="formatCode"
            class="btn"
            :disabled="!inputCode"
          >
            格式化代码
          </button>
          <button
            @click="copyCode"
            class="btn-secondary"
            :disabled="!formattedCode"
          >
            复制结果
          </button>
        </div>

        <!-- 格式化结果 -->
        <div v-if="formattedCode" class="mt-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            格式化结果
          </label>
          <div class="mt-1">
            <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-md overflow-x-auto"><code>{{ formattedCode }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import prettier from 'prettier/standalone'
import parserBabel from 'prettier/parser-babel'
import parserHtml from 'prettier/parser-html'
import parserCss from 'prettier/parser-postcss'
import parserTypescript from 'prettier/parser-typescript'

const language = ref('javascript')
const inputCode = ref('')
const formattedCode = ref('')
const options = ref({
  semicolons: true,
  singleQuote: false
})

const getParser = (lang: string) => {
  switch (lang) {
    case 'html':
      return { parser: 'html', plugins: [parserHtml] }
    case 'css':
      return { parser: 'css', plugins: [parserCss] }
    case 'javascript':
      return { parser: 'babel', plugins: [parserBabel] }
    case 'typescript':
      return { parser: 'typescript', plugins: [parserTypescript] }
    case 'json':
      return { parser: 'json', plugins: [parserBabel] }
    default:
      return { parser: 'babel', plugins: [parserBabel] }
  }
}

const formatCode = async () => {
  try {
    const { parser, plugins } = getParser(language.value)
    formattedCode.value = await prettier.format(inputCode.value, {
      parser,
      plugins,
      semi: options.value.semicolons,
      singleQuote: options.value.singleQuote
    })
  } catch (error) {
    console.error('Format error:', error)
    // 这里可以添加错误提示
  }
}

const copyCode = () => {
  navigator.clipboard.writeText(formattedCode.value)
  // 这里可以添加复制成功提示
}
</script> 