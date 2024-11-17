<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          图片拼贴
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          支持多张图片的自由布局和拼贴，可调整大小和位置
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
                <span class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500">
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

        <!-- 布局设置 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              布局模式
            </label>
            <select
              v-model="layout"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="grid">网格布局</option>
              <option value="pinterest">瀑布流布局</option>
              <option value="free">自由布局</option>
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
              max="50"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              背景颜色
            </label>
            <input
              type="color"
              v-model="backgroundColor"
              class="mt-1 block w-full h-10 rounded-md"
            >
          </div>
        </div>

        <!-- 图片列表和预览 -->
        <div v-if="images.length > 0" class="space-y-6">
          <!-- 图片列表 -->
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
          <div class="mt-6">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              预览
            </div>
            <div class="relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
              <canvas
                ref="canvas"
                class="w-full h-auto"
                :style="{
                  maxHeight: '600px',
                  objectFit: 'contain',
                  backgroundColor
                }"
              ></canvas>
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
              @click="downloadImage"
              class="btn"
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
import { ref, watch, onMounted, onUnmounted } from 'vue'

interface CollageImage {
  id: string
  file: File
  preview: string
  x?: number
  y?: number
  width?: number
  height?: number
}

const images = ref<CollageImage[]>([])
const canvas = ref<HTMLCanvasElement | null>(null)
const layout = ref<'grid' | 'pinterest' | 'free'>('grid')
const spacing = ref(10)
const backgroundColor = ref('#ffffff')
const selectedIndex = ref(-1)

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
  updateLayout()
}

// 移除图片
const removeImage = (index: number) => {
  URL.revokeObjectURL(images.value[index].preview)
  images.value.splice(index, 1)
  if (selectedIndex.value >= images.value.length) {
    selectedIndex.value = images.value.length - 1
  }
  updateLayout()
}

// 移动图片位置
const moveImage = (index: number, direction: number) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < images.value.length) {
    const temp = images.value[index]
    images.value[index] = images.value[newIndex]
    images.value[newIndex] = temp
    selectedIndex.value = newIndex
    updateLayout()
  }
}

// 清空图片
const clearImages = () => {
  images.value.forEach(image => {
    URL.revokeObjectURL(image.preview)
  })
  images.value = []
  selectedIndex.value = -1
}

// 更新布局
const updateLayout = async () => {
  if (!canvas.value || images.value.length === 0) return

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

    // 计算布局
    const containerWidth = canvas.value.parentElement?.clientWidth || 800
    let containerHeight = 0
    const padding = spacing.value

    if (layout.value === 'grid') {
      // 网格布局
      const cols = Math.min(4, images.value.length)
      const rows = Math.ceil(images.value.length / cols)
      const cellWidth = (containerWidth - (cols + 1) * padding) / cols
      const cellHeight = cellWidth

      containerHeight = rows * cellHeight + (rows + 1) * padding

      loadedImages.forEach((img, index) => {
        const col = index % cols
        const row = Math.floor(index / cols)
        images.value[index].x = padding + col * (cellWidth + padding)
        images.value[index].y = padding + row * (cellHeight + padding)
        images.value[index].width = cellWidth
        images.value[index].height = cellHeight
      })
    } else if (layout.value === 'pinterest') {
      // 瀑布流布局
      const cols = 3
      const columns = Array(cols).fill(0).map(() => ({
        height: padding,
        items: [] as { x: number, y: number, width: number, height: number }[]
      }))

      const cellWidth = (containerWidth - (cols + 1) * padding) / cols

      loadedImages.forEach((img, index) => {
        const ratio = img.height / img.width
        const height = cellWidth * ratio

        // 找到最短的列
        const shortestColumn = columns.reduce((prev, curr) => 
          curr.height < prev.height ? curr : prev
        )

        const item = {
          x: padding + columns.indexOf(shortestColumn) * (cellWidth + padding),
          y: shortestColumn.height,
          width: cellWidth,
          height
        }

        shortestColumn.items.push(item)
        shortestColumn.height += height + padding

        images.value[index].x = item.x
        images.value[index].y = item.y
        images.value[index].width = item.width
        images.value[index].height = item.height
      })

      containerHeight = Math.max(...columns.map(col => col.height))
    } else {
      // 自由布局
      // 这里可以实现拖拽调整位置的逻辑
    }

    // 设置画布尺寸
    canvas.value.width = containerWidth
    canvas.value.height = containerHeight

    // 绘制背景
    const ctx = canvas.value.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = backgroundColor.value
    ctx.fillRect(0, 0, containerWidth, containerHeight)

    // 绘制图片
    loadedImages.forEach((img, index) => {
      const { x = 0, y = 0, width = 0, height = 0 } = images.value[index]
      ctx.drawImage(img, x, y, width, height)
    })
  } catch (error) {
    console.error('Failed to update layout:', error)
  }
}

// 下载图片
const downloadImage = () => {
  if (!canvas.value) return

  const link = document.createElement('a')
  link.download = 'collage.png'
  link.href = canvas.value.toDataURL('image/png')
  link.click()
}

// 监听设置变化
watch([layout, spacing, backgroundColor], updateLayout)

// 添加窗口大小变化监听
onMounted(() => {
  window.addEventListener('resize', updateLayout)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLayout)
})
</script> 