<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          图片尺寸调整
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          调整图片尺寸，支持按比例缩放
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- 上传区域 -->
        <div v-if="!currentImage" class="flex justify-center">
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
                支持 JPG、PNG、WebP 格式
              </p>
            </div>
            <input type="file" class="sr-only" accept="image/*" @change="handleFileSelect">
          </label>
        </div>

        <!-- 图片预览和尺寸控制 -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 预览区域 -->
          <div class="lg:col-span-2">
            <div class="relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
              <canvas
                ref="canvas"
                class="w-full h-auto max-h-[600px] object-contain"
              ></canvas>
            </div>
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              原始尺寸: {{ originalWidth }} x {{ originalHeight }} px
            </div>
          </div>

          <!-- 控制面板 -->
          <div class="space-y-4">
            <!-- 调整方式 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                调整方式
              </label>
              <select
                v-model="resizeMode"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="custom">自定义尺寸</option>
                <option value="percentage">按百分比</option>
                <option value="preset">预设尺寸</option>
              </select>
            </div>

            <!-- 自定义尺寸 -->
            <template v-if="resizeMode === 'custom'">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    宽度 (px)
                  </label>
                  <input
                    type="number"
                    v-model.number="width"
                    min="1"
                    :max="maxWidth"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    @input="handleWidthChange"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    高度 (px)
                  </label>
                  <input
                    type="number"
                    v-model.number="height"
                    min="1"
                    :max="maxHeight"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    @input="handleHeightChange"
                  >
                </div>
              </div>
            </template>

            <!-- 百分比调整 -->
            <template v-else-if="resizeMode === 'percentage'">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  缩放比例
                </label>
                <div class="mt-1 flex items-center space-x-2">
                  <input
                    type="range"
                    v-model.number="percentage"
                    min="1"
                    max="200"
                    class="flex-1"
                  >
                  <span class="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                    {{ percentage }}%
                  </span>
                </div>
              </div>
            </template>

            <!-- 预设尺寸 -->
            <template v-else>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  预设尺寸
                </label>
                <select
                  v-model="selectedPreset"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                >
                  <option value="thumbnail">缩略图 (150x150)</option>
                  <option value="small">小图 (300x300)</option>
                  <option value="medium">中图 (800x600)</option>
                  <option value="large">大图 (1920x1080)</option>
                </select>
              </div>
            </template>

            <!-- 保持宽高比 -->
            <div class="flex items-center">
              <input
                type="checkbox"
                id="maintain-ratio"
                v-model="maintainRatio"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
              >
              <label for="maintain-ratio" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                保持宽高比
              </label>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-end space-x-4 pt-4">
              <button
                @click="resetImage"
                class="btn-secondary"
              >
                重置
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const currentImage = ref<string>('')
const canvas = ref<HTMLCanvasElement | null>(null)
const resizeMode = ref<'custom' | 'percentage' | 'preset'>('custom')
const width = ref(0)
const height = ref(0)
const originalWidth = ref(0)
const originalHeight = ref(0)
const maintainRatio = ref(true)
const percentage = ref(100)
const selectedPreset = ref('thumbnail')

const maxWidth = 10000
const maxHeight = 10000

const presets = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 300 },
  medium: { width: 800, height: 600 },
  large: { width: 1920, height: 1080 }
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  currentImage.value = URL.createObjectURL(file)
  loadImage()
}

// 加载图片到 Canvas
const loadImage = () => {
  if (!currentImage.value) return

  const img = new Image()
  img.onload = () => {
    if (!canvas.value) return
    const container = canvas.value.parentElement
    if (!container) return

    // 保存原始尺寸
    originalWidth.value = img.width
    originalHeight.value = img.height
    width.value = img.width
    height.value = img.height

    // 获取容器宽度
    const containerWidth = container.clientWidth
    // 计算缩放比例，保持宽高比
    const scale = containerWidth / img.width
    const scaledHeight = img.height * scale

    // 设置 canvas 尺寸
    canvas.value.width = containerWidth
    canvas.value.height = scaledHeight

    // 绘制图片
    const ctx = canvas.value.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img, 0, 0, containerWidth, scaledHeight)
  }
  img.src = currentImage.value
}

// 处理宽度变化
const handleWidthChange = () => {
  if (maintainRatio.value && originalWidth.value && originalHeight.value) {
    const ratio = originalHeight.value / originalWidth.value
    height.value = Math.round(width.value * ratio)
  }
  resizeImage()
}

// 处理高度变化
const handleHeightChange = () => {
  if (maintainRatio.value && originalWidth.value && originalHeight.value) {
    const ratio = originalWidth.value / originalHeight.value
    width.value = Math.round(height.value * ratio)
  }
  resizeImage()
}

// 监听百分比变化
watch(percentage, () => {
  if (originalWidth.value && originalHeight.value) {
    width.value = Math.round(originalWidth.value * percentage.value / 100)
    height.value = Math.round(originalHeight.value * percentage.value / 100)
    resizeImage()
  }
})

// 监听预设变化
watch(selectedPreset, () => {
  const preset = presets[selectedPreset.value as keyof typeof presets]
  if (preset) {
    width.value = preset.width
    height.value = preset.height
    resizeImage()
  }
})

// 调整图片尺寸
const resizeImage = () => {
  if (!canvas.value || !currentImage.value) return

  const img = new Image()
  img.onload = () => {
    if (!canvas.value) return

    canvas.value.width = width.value
    canvas.value.height = height.value

    const ctx = canvas.value.getContext('2d')
    if (!ctx) return

    ctx.drawImage(img, 0, 0, width.value, height.value)
  }
  img.src = currentImage.value
}

// 重置图片
const resetImage = () => {
  if (currentImage.value) {
    URL.revokeObjectURL(currentImage.value)
  }
  currentImage.value = ''
  width.value = 0
  height.value = 0
  originalWidth.value = 0
  originalHeight.value = 0
  percentage.value = 100
  selectedPreset.value = 'thumbnail'
  resizeMode.value = 'custom'
}

// 下载图片
const downloadImage = () => {
  if (!canvas.value) return

  const link = document.createElement('a')
  link.download = 'resized_image.png'
  link.href = canvas.value.toDataURL('image/png')
  link.click()
}

// 添加窗口大小变化监听
onMounted(() => {
  window.addEventListener('resize', loadImage)
})

onUnmounted(() => {
  window.removeEventListener('resize', loadImage)
})
</script> 