<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePreferredDark } from '@vueuse/core'
import MobileMenu from './components/MobileMenu.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import SearchPanel from './components/SearchPanel.vue'
import { useHotkeys } from './composables/useHotkeys'
import PageTransition from './components/PageTransition.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import GlobalLoading from './components/GlobalLoading.vue'
import ProgressBar from './components/ProgressBar.vue'
import Message from './components/Message.vue'
import { onErrorCaptured } from 'vue'
import ShortcutMenuButton from './components/ShortcutMenuButton.vue'

const isDark = ref(usePreferredDark().value)
const router = useRouter()
const searchPanel = ref()
const mobileMenu = ref()
const settingsPanel = ref()
const errorBoundary = ref()
const globalLoading = ref()
const progressBar = ref()
const message = ref()
const isShortcutMenuOpen = ref(false)
const shortcutMenu = ref()

const navigation = [
  { name: '图片工具', path: '/image' },
  { name: '视频工具', path: '/video' },
  { name: '代码工具', path: '/code' },
  { name: '前往社区', path: 'https://bbs.vip247.icu/t/container-toolboxk' }
]

const toggleTheme = () => {
  isDark.value = !isDark.value
  updateTheme()
}

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 监听系统主题变化
watch(isDark, () => {
  updateTheme()
})

// 初始化主题
updateTheme()

const openSearch = () => {
  searchPanel.value?.open()
}

const openMobileMenu = () => {
  mobileMenu.value?.open()
}

const openSettings = () => {
  settingsPanel.value?.open()
}

// 添加快捷键支持
useHotkeys([
  { key: 'k', ctrl: true, handler: openSearch },
  { key: '/', handler: openSearch },
  { key: ',', ctrl: true, handler: openSettings }
])

// 路由切换时显示进度条
router.beforeEach(() => {
  progressBar.value?.start()
})

router.afterEach(() => {
  progressBar.value?.finish()
})

// 全局错误处理
onErrorCaptured((err, instance, info) => {
  console.error('Captured error:', err)
  errorBoundary.value?.handleError(err as Error)
  message.value?.error((err as Error).message)
  return false // 阻止错误继续传播
})

const toggleShortcutMenu = () => {
  isShortcutMenuOpen.value = !isShortcutMenuOpen.value
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 theme-transition">
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-40 w-full nav-blur border-b border-gray-200/50 dark:border-gray-700/50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo 和标题 -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                Cereals tools
              </router-link>
            </div>
          </div>

          <!-- 主导航 -->
          <div class="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-2">
            <router-link 
              v-for="nav in navigation" 
              :key="nav.path"
              :to="nav.path"
              class="inline-flex items-center justify-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-300"
              :class="[
                $route.path.includes(nav.path)
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200 scale-105'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50 hover:scale-105'
              ]"
            >
              {{ nav.name }}
            </router-link>
          </div>

          <!-- 右侧功能按钮 -->
          <div class="flex items-center space-x-2">
            <!-- 搜索按钮 -->
            <button
              @click="openSearch"
              class="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <!-- 主题切换按钮 -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <svg v-if="isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            <!-- 快捷键按钮 -->
            <button
              @click="toggleShortcutMenu"
              class="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </button>

            <!-- 设置按钮 -->
            <button
              @click="openSettings"
              class="p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            <!-- 移动端菜单按钮 -->
            <button
              @click="openMobileMenu"
              class="sm:hidden p-2 rounded-full text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>

    <!-- 主内容区 -->
    <main class="flex-grow max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- 背景装饰 -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-primary opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute top-60 -left-40 w-80 h-80 bg-gradient-secondary opacity-5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      </div>

      <!-- 路由内容 -->
      <div class="relative">
        <router-view v-slot="{ Component }">
          <PageTransition>
            <component :is="Component" />
          </PageTransition>
        </router-view>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="mt-auto bg-white/50 dark:bg-gray-800/50 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div class="text-center text-gray-500 dark:text-gray-400 text-sm">
          © 2024 Cereals Tools. All rights reserved.
        </div>
      </div>
    </footer>

    <!-- 移动端菜单 -->
    <MobileMenu ref="mobileMenu" />
    <SettingsPanel ref="settingsPanel" />
    <SearchPanel ref="searchPanel" />
    <ErrorBoundary ref="errorBoundary" />
    <GlobalLoading ref="globalLoading" />
    <ProgressBar ref="progressBar" />
    <Message ref="message" />
    <ShortcutMenuButton 
      ref="shortcutMenu"
      :is-open="isShortcutMenuOpen"
      @update:is-open="isShortcutMenuOpen = $event"
      @open-settings="openSettings"
    />
  </div>
</template>

<style>
/* 基础变量 */
:root {
  --bg-primary: theme('colors.gray.50');
  --text-primary: theme('colors.gray.900');
  --transition-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

.dark {
  --bg-primary: theme('colors.gray.900');
  --text-primary: theme('colors.gray.50');
}

body {
  @apply antialiased;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s var(--transition-smooth);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

/* 导航链接动画 */
.router-link-active {
  transition: all 0.3s var(--transition-bounce);
}

/* 按钮悬停动画 */
button {
  transition: all 0.3s var(--transition-bounce);
}

button:active {
  transform: scale(0.95);
}

/* 卡片悬停动画 */
.card {
  transition: all 0.3s var(--transition-bounce);
}

.card:hover {
  transform: translateY(-2px);
}

/* 背景渐变动画 */
.bg-gradient-animated {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 导航栏毛玻璃效果 */
.nav-blur {
  backdrop-filter: saturate(180%) blur(20px);
  background-color: rgba(255, 255, 255, 0.7);
}

.dark .nav-blur {
  background-color: rgba(17, 24, 39, 0.7);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* 主题切换动画 */
.theme-transition {
  transition: background-color 0.5s var(--transition-smooth),
              color 0.5s var(--transition-smooth),
              border-color 0.5s var(--transition-smooth),
              box-shadow 0.5s var(--transition-smooth);
}

/* 图标动画 */
.icon-spin {
  animation: spin 20s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 波纹效果 */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 10%, transparent 10.01%);
  transform: scale(10);
  opacity: 0;
  transition: transform 0.5s, opacity 1s;
}

.ripple:active::after {
  transform: scale(0);
  opacity: 0.3;
  transition: 0s;
}
</style>
