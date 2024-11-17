<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          图片水印
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          添加文字或图片水印，支持自定义位置和透明度
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

        <!-- 图片预览和水印控制 -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 预览区域 -->
          <div class="lg:col-span-2">
            <div class="relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
              <canvas
                ref="canvas"
                class="w-full h-auto max-h-[600px] object-contain"
              ></canvas>
            </div>
          </div>

          <!-- 控制面板 -->
          <div class="space-y-4">
            <!-- 水印类型 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                水印类型
              </label>
              <select
                v-model="watermarkType"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="text">文字水印</option>
                <option value="image">图片水印</option>
              </select>
            </div>

            <!-- 文字水印设置 -->
            <template v-if="watermarkType === 'text'">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  水印文字
                </label>
                <input
                  type="text"
                  v-model="watermarkText"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  placeholder="输入水印文字"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  字体大小
                </label>
                <input
                  type="range"
                  v-model.number="fontSize"
                  min="12"
                  max="72"
                  class="mt-1 block w-full"
                >
                <div class="mt-1 text-sm text-gray-500">{{ fontSize }}px</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  字体颜色
                </label>
                <input
                  type="color"
                  v-model="textColor"
                  class="mt-1 block w-full h-10 rounded-md"
                >
              </div>
            </template>

            <!-- 图片水印设置 -->
            <template v-else>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  水印图片
                </label>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleWatermarkImageSelect"
                  class="mt-1 block w-full"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  水印大小
                </label>
                <input
                  type="range"
                  v-model.number="watermarkSize"
                  min="10"
                  max="100"
                  class="mt-1 block w-full"
                >
                <div class="mt-1 text-sm text-gray-500">{{ watermarkSize }}%</div>
              </div>
            </template>

            <!-- 通用设置 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                透明度
              </label>
              <input
                type="range"
                v-model.number="opacity"
                min="0"
                max="100"
                class="mt-1 block w-full"
              >
              <div class="mt-1 text-sm text-gray-500">{{ opacity }}%</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                位置
              </label>
              <div class="mt-1 grid grid-cols-3 gap-2">
                <button
                  v-for="pos in positions"
                  :key="pos.value"
                  @click="position = pos.value"
                  class="p-2 rounded-md text-sm"
                  :class="position === pos.value ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'"
                >
                  {{ pos.label }}
                </button>
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
import { ref, watch, onMounted, onUnmounted } from 'vue'

const currentImage = ref<string>('')
const canvas = ref<HTMLCanvasElement | null>(null)
const watermarkType = ref<'text' | 'image'>('text')
const watermarkText = ref('水印文字')
const fontSize = ref(24)
const textColor = ref('#000000')
const opacity = ref(50)
const watermarkSize = ref(30)
const watermarkImage = ref<HTMLImageElement | null>(null)
const position = ref('center')

const positions = [
  { value: 'top-left', label: '左上' },
  { value: 'top-center', label: '上中' },
  { value: 'top-right', label: '右上' },
  { value: 'center-left', label: '左中' },
  { value: 'center', label: '中心' },
  { value: 'center-right', label: '右中' },
  { value: 'bottom-left', label: '左下' },
  { value: 'bottom-center', label: '下中' },
  { value: 'bottom-right', label: '右下' }
]

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  currentImage.value = URL.createObjectURL(file)
  loadImage()
}

// 处理水印图片选择
const handleWatermarkImageSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const img = new Image()
  img.onload = () => {
    watermarkImage.value = img
    drawWatermark()
  }
  img.src = URL.createObjectURL(file)
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
    drawWatermark()
  }
  img.src = currentImage.value
}

// 绘制水印
const drawWatermark = () => {
  if (!canvas.value || !currentImage.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // 清除画布
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  // 重新绘制原图
  const img = new Image()
  img.onload = () => {
    if (!canvas.value || !ctx) return
    
    // 使用当前 canvas 尺寸绘制
    ctx.drawImage(img, 0, 0, canvas.value.width, canvas.value.height)

    // 设置透明度
    ctx.globalAlpha = opacity.value / 100

    if (watermarkType.value === 'text' && watermarkText.value) {
      // 根据 canvas 尺寸调整字体大小
      const fontSize = Math.min(canvas.value.width * 0.05, 72)
      ctx.font = `${fontSize}px Arial`
      ctx.fillStyle = textColor.value
      const metrics = ctx.measureText(watermarkText.value)
      const [x, y] = getPosition(metrics.width, fontSize)
      ctx.fillText(watermarkText.value, x, y)
    } else if (watermarkType.value === 'image' && watermarkImage.value) {
      // 根据 canvas 尺寸调整水印大小
      const width = canvas.value.width * (watermarkSize.value / 100)
      const height = width * (watermarkImage.value.height / watermarkImage.value.width)
      const [x, y] = getPosition(width, height)
      ctx.drawImage(watermarkImage.value, x, y, width, height)
    }

    // 恢复透明度
    ctx.globalAlpha = 1
  }
  img.src = currentImage.value
}

// 计算水印位置
const getPosition = (width: number, height: number): [number, number] => {
  if (!canvas.value) return [0, 0]

  const padding = 20
  const positions: Record<string, [number, number]> = {
    'top-left': [padding, padding + height],
    'top-center': [(canvas.value.width - width) / 2, padding + height],
    'top-right': [canvas.value.width - width - padding, padding + height],
    'center-left': [padding, (canvas.value.height - height) / 2],
    'center': [(canvas.value.width - width) / 2, (canvas.value.height - height) / 2],
    'center-right': [canvas.value.width - width - padding, (canvas.value.height - height) / 2],
    'bottom-left': [padding, canvas.value.height - padding],
    'bottom-center': [(canvas.value.width - width) / 2, canvas.value.height - padding],
    'bottom-right': [canvas.value.width - width - padding, canvas.value.height - padding]
  }

  return positions[position.value] || positions['center']
}

// 监听参数变化
watch(
  [watermarkType, watermarkText, fontSize, textColor, opacity, watermarkSize, position],
  drawWatermark
)

// 重置图片
const resetImage = () => {
  if (currentImage.value) {
    URL.revokeObjectURL(currentImage.value)
  }
  currentImage.value = ''
  watermarkText.value = '水印文字'
  fontSize.value = 24
  textColor.value = '#000000'
  opacity.value = 50
  watermarkSize.value = 30
  watermarkImage.value = null
  position.value = 'center'
}

// 下载图片
const downloadImage = () => {
  if (!canvas.value) return

  const link = document.createElement('a')
  link.download = 'watermarked_image.png'
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