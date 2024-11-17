<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50 lg:hidden" @close="close">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 z-50 flex">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 -translate-x-full"
          enter-to="opacity-100 translate-x-0"
          leave="duration-200 ease-in"
          leave-from="opacity-100 translate-x-0"
          leave-to="opacity-0 -translate-x-full"
        >
          <DialogPanel class="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-gray-800 pb-12 shadow-xl">
            <div class="flex px-4 pb-2 pt-5">
              <button
                type="button"
                class="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500"
                @click="close"
              >
                <span class="absolute -inset-0.5" />
                <span class="sr-only">关闭菜单</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- 导航链接 -->
            <div class="mt-2">
              <div class="border-b border-gray-200 dark:border-gray-700">
                <div class="-mb-px flex space-x-8 px-4" aria-orientation="horizontal" role="tablist">
                  <router-link
                    v-for="nav in navigation"
                    :key="nav.path"
                    :to="nav.path"
                    class="flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium transition-colors"
                    :class="[
                      $route.path.includes(nav.path)
                        ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-gray-900 hover:text-gray-600 dark:text-gray-100 dark:hover:text-gray-300'
                    ]"
                    @click="close"
                  >
                    {{ nav.name }}
                  </router-link>
                </div>
              </div>
            </div>

            <!-- 设置选项 -->
            <div class="space-y-6 px-4 py-6">
              <div class="flow-root">
                <button
                  @click="openSettings"
                  class="group -m-2 flex items-center p-2 w-full"
                >
                  <svg class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-200">设置</span>
                </button>
              </div>

              <div class="flow-root">
                <button
                  @click="toggleTheme"
                  class="group -m-2 flex items-center p-2 w-full"
                >
                  <svg class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path v-if="isDark" stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                  <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 dark:text-gray-300 dark:group-hover:text-gray-200">
                    {{ isDark ? '浅色模式' : '深色模式' }}
                  </span>
                </button>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useAppStore } from '../stores/app'

const store = useAppStore()
const isOpen = ref(false)
const isDark = ref(store.isDark)

const navigation = [
  { name: '图片工具', path: '/image' },
  { name: '视频工具', path: '/video' },
  { name: '代码工具', path: '/code' },
  { name: '前往社区', path: 'https://bbs.vip247.icu/t/container-toolboxk' }
]

const close = () => {
  isOpen.value = false
}

const openSettings = () => {
  close()
  // 触发设置面板打开
}

const toggleTheme = () => {
  store.setTheme(isDark.value ? 'light' : 'dark')
  isDark.value = !isDark.value
}

defineExpose({
  open: () => {
    isOpen.value = true
  }
})
</script> 