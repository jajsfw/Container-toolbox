<template>
  <div class="relative">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 -z-10">
      <div 
        class="absolute transition-all duration-500 ease-spring-bounce"
        :style="{
          left: activeTabPosition.left + 'px',
          top: activeTabPosition.top + 'px',
          width: activeTabPosition.width + 'px',
          height: activeTabPosition.height + 'px',
          transform: 'scale(1.05)',
          opacity: 0.1
        }"
      >
        <div class="w-full h-full bg-gradient-primary rounded-full blur-md"></div>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-2">
      <!-- 全部工具分类 -->
      <button
        ref="allTabRef"
        @click="$emit('update:modelValue', 'all')"
        class="group px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
        :class="[
          modelValue === 'all'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 scale-105'
            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 hover:scale-105'
        ]"
      >
        <div class="flex items-center space-x-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span>全部工具</span>
        </div>
      </button>

      <!-- 其他分类 -->
      <TransitionGroup
        tag="div"
        class="flex flex-wrap justify-center gap-2"
        enter-active-class="transition duration-500 ease-spring"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-300 ease-spring"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
        move-class="transition duration-500 ease-spring"
      >
        <button
          v-for="category in categories"
          :key="category.id"
          :ref="el => categoryRefs[category.id] = el"
          @click="$emit('update:modelValue', category.id)"
          class="group px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
          :class="[
            modelValue === category.id
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 scale-105'
              : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 hover:scale-105'
          ]"
        >
          <div class="flex items-center space-x-2">
            <component :is="icons[category.icon]" class="h-4 w-4" />
            <span>{{ category.name }}</span>
            <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 dark:bg-blue-500 rounded-full">
              {{ getCategoryToolCount(category.id) }}
            </span>
          </div>
        </button>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { categories } from '../types/category'
import * as icons from './icons'
import type { Tool } from '../types/tool'

const props = defineProps<{
  modelValue: string
  tools?: Tool[]
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 引用所有分类按钮
const allTabRef = ref<HTMLElement | null>(null)
const categoryRefs = ref<Record<string, HTMLElement | null>>({})

// 活动标签的位置信息
const activeTabPosition = ref({
  left: 0,
  top: 0,
  width: 0,
  height: 0
})

// 更新活动标签位置
const updateActiveTabPosition = () => {
  const activeTab = props.modelValue === 'all' 
    ? allTabRef.value 
    : categoryRefs.value[props.modelValue]

  if (activeTab) {
    const rect = activeTab.getBoundingClientRect()
    const parentRect = activeTab.parentElement?.getBoundingClientRect() || rect

    activeTabPosition.value = {
      left: rect.left - parentRect.left,
      top: rect.top - parentRect.top,
      width: rect.width,
      height: rect.height
    }
  }
}

// 监听选中分类的变化
watch(() => props.modelValue, updateActiveTabPosition)

// 组件挂载后初始化位置
onMounted(() => {
  updateActiveTabPosition()
  // 监听窗口大小变化
  window.addEventListener('resize', updateActiveTabPosition)
})

// 计算每个分类下的工具数量
const getCategoryToolCount = (categoryId: string) => {
  if (!props.tools) return 0
  return props.tools.filter(tool => tool.category === categoryId).length
}
</script>

<style>
/* 弹性动画 */
.ease-spring {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.ease-spring-bounce {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 移动动画 */
.v-move {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style> 