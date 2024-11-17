<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          图片滤镜
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          添加滤镜效果，支持多种预设和自定义调整
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

        <!-- 图片预览和滤镜控制 -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 预览区域 -->
          <div class="lg:col-span-2">
            <div class="relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
              <canvas
                ref="canvas"
                class="w-full h-auto max-h-[600px] object-contain"
                :style="{
                  filter: `
                    brightness(${filters.brightness}%)
                    contrast(${filters.contrast}%)
                    saturate(${filters.saturation}%)
                    hue-rotate(${filters.hue}deg)
                    blur(${filters.blur}px)
                    grayscale(${filters.grayscale}%)
                    sepia(${filters.sepia}%)
                  `
                }"
              ></canvas>
            </div>
          </div>

          <!-- 控制面板 -->
          <div class="space-y-4">
            <!-- 预设滤镜 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                预设滤镜
              </label>
              <select
                v-model="selectedPreset"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="">自定义</option>
                <option value="vintage">复古</option>
                <option value="blackAndWhite">黑白</option>
                <option value="warm">暖色调</option>
                <option value="cool">冷色调</option>
                <option value="sharp">锐化</option>
                <option value="blur">模糊</option>
              </select>
            </div>

            <!-- 滤镜调节 -->
            <div class="space-y-4">
              <div v-for="(value, key) in filters" :key="key">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ filterLabels[key] }}
                </label>
                <div class="mt-1 flex items-center space-x-2">
                  <input
                    type="range"
                    v-model.number="filters[key]"
                    :min="filterRanges[key].min"
                    :max="filterRanges[key].max"
                    :step="filterRanges[key].step"
                    class="flex-1"
                  >
                  <span class="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                    {{ value }}{{ filterUnits[key] }}
                  </span>
                </div>
              </div>
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
import { ref, onMounted, watch, onUnmounted } from 'vue'

interface Filters {
  brightness: number
  contrast: number
  saturation: number
  hue: number
  blur: number
  grayscale: number
  sepia: number
}

const filterLabels: Record<keyof Filters, string> = {
  brightness: '亮度',
  contrast: '对比度',
  saturation: '饱和度',
  hue: '色相',
  blur: '模糊',
  grayscale: '灰度',
  sepia: '褐色'
}

const filterUnits: Record<keyof Filters, string> = {
  brightness: '%',
  contrast: '%',
  saturation: '%',
  hue: '°',
  blur: 'px',
  grayscale: '%',
  sepia: '%'
}

const filterRanges: Record<keyof Filters, { min: number; max: number; step: number }> = {
  brightness: { min: 0, max: 200, step: 1 },
  contrast: { min: 0, max: 200, step: 1 },
  saturation: { min: 0, max: 200, step: 1 },
  hue: { min: 0, max: 360, step: 1 },
  blur: { min: 0, max: 10, step: 0.1 },
  grayscale: { min: 0, max: 100, step: 1 },
  sepia: { min: 0, max: 100, step: 1 }
}

const presets = {
  vintage: {
    brightness: 110,
    contrast: 120,
    saturation: 90,
    hue: 0,
    blur: 0,
    grayscale: 20,
    sepia: 30
  },
  blackAndWhite: {
    brightness: 100,
    contrast: 120,
    saturation: 0,
    hue: 0,
    blur: 0,
    grayscale: 100,
    sepia: 0
  },
  warm: {
    brightness: 105,
    contrast: 110,
    saturation: 120,
    hue: 15,
    blur: 0,
    grayscale: 0,
    sepia: 20
  },
  cool: {
    brightness: 95,
    contrast: 110,
    saturation: 120,
    hue: 180,
    blur: 0,
    grayscale: 0,
    sepia: 0
  },
  sharp: {
    brightness: 100,
    contrast: 150,
    saturation: 110,
    hue: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0
  },
  blur: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 5,
    grayscale: 0,
    sepia: 0
  }
}

const currentImage = ref<string>('')
const canvas = ref<HTMLCanvasElement | null>(null)
const selectedPreset = ref('')
const filters = ref<Filters>({
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0
})

// 监听预设变化
watch(selectedPreset, (preset) => {
  if (preset && preset in presets) {
    filters.value = { ...presets[preset as keyof typeof presets] }
  }
})

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

// 重置图片
const resetImage = () => {
  selectedPreset.value = ''
  filters.value = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0
  }
}

// 下载图片
const downloadImage = () => {
  if (!canvas.value) return

  // 创建一个新的 canvas 来应用滤镜
  const outputCanvas = document.createElement('canvas')
  outputCanvas.width = canvas.value.width
  outputCanvas.height = canvas.value.height
  const ctx = outputCanvas.getContext('2d')
  if (!ctx) return

  // 应用滤镜
  ctx.filter = `
    brightness(${filters.value.brightness}%)
    contrast(${filters.value.contrast}%)
    saturate(${filters.value.saturation}%)
    hue-rotate(${filters.value.hue}deg)
    blur(${filters.value.blur}px)
    grayscale(${filters.value.grayscale}%)
    sepia(${filters.value.sepia}%)
  `
  ctx.drawImage(canvas.value, 0, 0)

  // 下载
  const link = document.createElement('a')
  link.download = 'filtered_image.png'
  link.href = outputCanvas.toDataURL('image/png')
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