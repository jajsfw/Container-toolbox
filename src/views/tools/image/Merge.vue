<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          图片拼接
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          支持多张图片的横向和纵向拼接
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- 上传区域 -->
        <div class="flex justify-center">
          <label class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600 dark:text-gray-400">
                <span class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  选择图片
                </span>
                <p class="pl-1">或拖拽图片到这里</p>
              </div>
              <p class="text-xs text-gray-500">
                支持多张图片，JPG、PNG、WebP 格式
              </p>
            </div>
            <input type="file" class="sr-only" accept="image/*" multiple @change="handleFileSelect">
          </label>
        </div>

        <!-- 拼接设置 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              拼接方向
            </label>
            <select
              v-model="direction"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="horizontal">横向拼接</option>
              <option value="vertical">纵向拼接</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              间距 (px)
            </label>
            <input
              type="number"
              v-model.number="spacing"
              min="0"
              max="100"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
          </div>
        </div>

        <!-- 图片列表 -->
        <div v-if="images.length > 0" class="space-y-4">
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
            已选择 {{ images.length }} 张图片
          </div>
          
          <!-- 图片预览和排序 -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div
              v-for="(image, index) in images"
              :key="image.id"
              class="relative group"
            >
              <img
                :src="image.preview"
                class="w-full aspect-square object-cover rounded-lg"
                :class="{ 'border-2 border-blue-500': selectedIndex === index }"
                @click="selectedIndex = index"
              >
              
              <!-- 操作按钮 -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                <button
                  v-if="index > 0"
                  @click="moveImage(index, -1)"
                  class="p-1 text-white hover:text-blue-400"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  @click="removeImage(index)"
                  class="p-1 text-white hover:text-red-400"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <button
                  v-if="index < images.length - 1"
                  @click="moveImage(index, 1)"
                  class="p-1 text-white hover:text-blue-400"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 预览区域 -->
          <div v-if="mergedPreview" class="mt-6">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              预览
            </div>
            <div class="relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
              <img
                :src="mergedPreview"
                class="max-w-full h-auto"
                :style="{
                  maxHeight: '600px',
                  objectFit: 'contain'
                }"
              >
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end space-x-4">
            <button
              @click="clearImages"
              class="btn-secondary"
            >
              清空
            </button>
            <button
              @click="downloadMerged"
              class="btn"
              :disabled="!mergedPreview"
            >
              下载
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface ImageItem {
  id: string
  file: File
  preview: string
}

const images = ref<ImageItem[]>([])
const direction = ref<'horizontal' | 'vertical'>('horizontal')
const spacing = ref(10)
const selectedIndex = ref(-1)
const mergedPreview = ref('')

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const newFiles = Array.from(input.files).map(file => ({
    id: Math.random().toString(36).slice(2),
    file,
    preview: URL.createObjectURL(file)
  }))

  images.value.push(...newFiles)
  updateMergedPreview()
}

// 移除图片
const removeImage = (index: number) => {
  URL.revokeObjectURL(images.value[index].preview)
  images.value.splice(index, 1)
  if (selectedIndex.value >= images.value.length) {
    selectedIndex.value = images.value.length - 1
  }
  updateMergedPreview()
}

// 移动图片位置
const moveImage = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < images.value.length) {
    const temp = images.value[index]
    images.value[index] = images.value[newIndex]
    images.value[newIndex] = temp
    selectedIndex.value = newIndex
    updateMergedPreview()
  }
}

// 清空图片
const clearImages = () => {
  images.value.forEach(image => {
    URL.revokeObjectURL(image.preview)
  })
  images.value = []
  selectedIndex.value = -1
  mergedPreview.value = ''
}

// 更新合并预览
const updateMergedPreview = async () => {
  if (images.value.length === 0) {
    mergedPreview.value = ''
    return
  }

  try {
    // 加载所有图片
    const loadedImages = await Promise.all(
      images.value.map(image => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = image.preview
        })
      })
    )

    // 计算画布尺寸
    let totalWidth = 0
    let totalHeight = 0
    let maxWidth = 0
    let maxHeight = 0

    loadedImages.forEach(img => {
      if (direction.value === 'horizontal') {
        totalWidth += img.width
        maxHeight = Math.max(maxHeight, img.height)
      } else {
        totalHeight += img.height
        maxWidth = Math.max(maxWidth, img.width)
      }
    })

    // 添加间距
    if (direction.value === 'horizontal') {
      totalWidth += spacing.value * (loadedImages.length - 1)
    } else {
      totalHeight += spacing.value * (loadedImages.length - 1)
    }

    // 创建画布
    const canvas = document.createElement('canvas')
    canvas.width = direction.value === 'horizontal' ? totalWidth : maxWidth
    canvas.height = direction.value === 'horizontal' ? maxHeight : totalHeight

    // 绘制图片
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let currentX = 0
    let currentY = 0

    loadedImages.forEach((img, index) => {
      if (direction.value === 'horizontal') {
        ctx.drawImage(img, currentX, 0)
        currentX += img.width + spacing.value
      } else {
        ctx.drawImage(img, 0, currentY)
        currentY += img.height + spacing.value
      }
    })

    // 更新预览
    mergedPreview.value = canvas.toDataURL('image/png')
  } catch (error) {
    console.error('Failed to merge images:', error)
  }
}

// 下载合并后的图片
const downloadMerged = () => {
  if (!mergedPreview.value) return

  const link = document.createElement('a')
  link.download = 'merged_image.png'
  link.href = mergedPreview.value
  link.click()
}

// 监听设置变化
watch([direction, spacing], updateMergedPreview)
</script> 