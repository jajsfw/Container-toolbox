<template>
  <TransitionRoot :show="isOpen" as="template" appear>
    <Dialog as="div" class="relative z-50" @close="close">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/25 dark:bg-black/40 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="mx-auto max-w-2xl transform divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden rounded-xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/5 transition-all">
            <div class="relative">
              <svg
                class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 sm:text-sm"
                placeholder="搜索工具..."
                v-model="query"
                @keydown.esc="close"
                @keydown.enter="selectTool"
              />
            </div>

            <ul
              v-if="filteredTools.length > 0"
              class="max-h-96 scroll-py-3 overflow-y-auto p-3"
              role="listbox"
            >
              <li
                v-for="tool in filteredTools"
                :key="tool.id"
                class="group relative cursor-pointer select-none rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                role="option"
                @click="selectTool(tool)"
              >
                <div class="flex items-center">
                  <div :class="[
                    'flex h-10 w-10 flex-none items-center justify-center rounded-lg',
                    tool.gradientColor
                  ]">
                    <component :is="tool.icon" class="h-6 w-6 text-white" />
                  </div>
                  <div class="ml-4 flex-auto">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {{ tool.name }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ tool.description }}
                    </p>
                  </div>
                  <div class="ml-3 flex-none text-sm font-medium text-gray-400 dark:text-gray-500">
                    <kbd class="font-sans">↵</kbd>
                  </div>
                </div>
              </li>
            </ul>

            <div
              v-else-if="query"
              class="p-6 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              没有找到相关工具
            </div>

            <div
              v-if="filteredTools.length > 0"
              class="flex flex-wrap items-center bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="mx-1 flex h-5 w-5 items-center justify-center rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100"
              >
                esc
              </kbd>
              关闭
              <span class="mx-2">·</span>
              <kbd
                class="mx-1 flex h-5 w-5 items-center justify-center rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-semibold text-gray-900 dark:text-gray-100"
              >
                ↵
              </kbd>
              选择
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import { ImageIcon, VideoIcon, CodeIcon, CryptoIcon } from './icons'
import type { Tool } from '../types/tool'

const router = useRouter()
const isOpen = ref(false)
const query = ref('')

const tools: Tool[] = [
  {
    id: 'image-compress',
    name: '图压缩',
    description: '无损压缩图片，支持批量处理',
    path: '/image/compress',
    category: 'image',
    gradientColor: 'bg-gradient-primary',
    tags: ['JPG', 'PNG', 'WebP'],
    icon: ImageIcon
  },
  {
    id: 'video-compress',
    name: '视频压缩',
    description: '视频压缩转码，支持多种格式',
    path: '/video/compress',
    category: 'video',
    gradientColor: 'bg-gradient-success',
    tags: ['MP4', 'AVI', 'MOV'],
    icon: VideoIcon
  },
  {
    id: 'code-formatter',
    name: '代码格式化',
    description: '支持多种语言的代码格式化',
    path: '/code/formatter',
    category: 'code',
    gradientColor: 'bg-gradient-secondary',
    tags: ['HTML', 'CSS', 'JS'],
    icon: CodeIcon
  },
  {
    id: 'crypto-hash',
    name: '哈希计算',
    description: '计算文件或文本的哈希值',
    path: '/crypto/hash',
    category: 'crypto',
    gradientColor: 'bg-gradient-warning',
    tags: ['MD5', 'SHA1', 'SHA256'],
    icon: CryptoIcon
  }
]

const filteredTools = computed(() => {
  if (!query.value) return tools
  const searchQuery = query.value.toLowerCase()
  return tools.filter(tool => {
    return (
      tool.name.toLowerCase().includes(searchQuery) ||
      tool.description.toLowerCase().includes(searchQuery) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery))
    )
  })
})

const selectTool = (tool?: Tool) => {
  if (!tool && filteredTools.value.length > 0) {
    tool = filteredTools.value[0]
  }
  if (tool) {
    router.push(tool.path)
    close()
  }
}

const close = () => {
  isOpen.value = false
  query.value = ''
}

defineExpose({
  open: () => {
    isOpen.value = true
  }
})
</script> 