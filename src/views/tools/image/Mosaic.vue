<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          图片马赛克
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          添加马赛克效果，支持自定义区域和程度
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
                <span class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500">
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

        <!-- 图片预览和马赛克控制 -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 预览区域 -->
          <div class="lg:col-span-2">
            <div class="relative overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
              <canvas
                ref="canvas"
                class="w-full h-auto max-h-[600px] object-contain"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="stopDrawing"
              ></canvas>
            </div>
          </div>

          <!-- 控制面板 -->
          <div class="space-y-4">
            <!-- 马赛克大小 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                马赛克大小
              </label>
              <input
                type="range"
                v-model.number="blockSize"
                min="2"
                max="50"
                class="mt-1 block w-full"
              >
              <div class="mt-1 text-sm text-gray-500">{{ blockSize }}px</div>
            </div>

            <!-- 画笔大小 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                画笔大小
              </label>
              <input
                type="range"
                v-model.number="brushSize"
                min="10"
                max="100"
                class="mt-1 block w-full"
              >
              <div class="mt-1 text-sm text-gray-500">{{ brushSize }}px</div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex justify-end space-x-4 pt-4">
              <button
                @click="undo"
                class="btn-secondary"
                :disabled="!canUndo"
              >
                撤销
              </button>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentImage = ref<string>('')
const canvas = ref<HTMLCanvasElement | null>(null)
const blockSize = ref(10)
const brushSize = ref(30)
const isDrawing = ref(false)
const lastX = ref(0)
const lastY = ref(0)
const history = ref<ImageData[]>([])
const historyIndex = ref(-1)

const canUndo = computed(() => historyIndex.value > 0)

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

    // 保存初始状态
    saveState()
  }
  img.src = currentImage.value
}

// 开始绘制
const startDrawing = (event: MouseEvent) => {
  isDrawing.value = true
  const rect = canvas.value?.getBoundingClientRect()
  if (!rect) return
  lastX.value = event.clientX - rect.left
  lastY.value = event.clientY - rect.top
}

// 绘制马赛克
const draw = (event: MouseEvent) => {
  if (!isDrawing.value || !canvas.value) return

  const rect = canvas.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // 在鼠标移动路径上应用马赛克效果
  applyMosaicEffect(ctx, x, y)

  lastX.value = x
  lastY.value = y
}

// 停止绘制
const stopDrawing = () => {
  if (isDrawing.value) {
    isDrawing.value = false
    saveState()
  }
}

// 应用马赛克效果
const applyMosaicEffect = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const size = blockSize.value
  const radius = brushSize.value / 2

  // 计算受影响的区域
  const startX = Math.max(0, x - radius)
  const startY = Math.max(0, y - radius)
  const endX = Math.min(canvas.value!.width, x + radius)
  const endY = Math.min(canvas.value!.height, y + radius)

  // 对区域内的每个马赛克块应用效果
  for (let blockY = startY - (startY % size); blockY < endY; blockY += size) {
    for (let blockX = startX - (startX % size); blockX < endX; blockX += size) {
      // 检查块的中心是否在画笔范围内
      const centerX = blockX + size / 2
      const centerY = blockY + size / 2
      const distance = Math.sqrt((centerX - x) ** 2 + (centerY - y) ** 2)
      if (distance > radius) continue

      // 获取块的平均颜色
      const imageData = ctx.getImageData(blockX, blockY, size, size)
      const { r, g, b } = getAverageColor(imageData.data)

      // 填充马赛克块
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(blockX, blockY, size, size)
    }
  }
}

// 计算平均颜色
const getAverageColor = (data: Uint8ClampedArray) => {
  let r = 0, g = 0, b = 0, count = 0
  for (let i = 0; i < data.length; i += 4) {
    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
    count++
  }
  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count)
  }
}

// 保存状态
const saveState = () => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // 删除当前状态之后的历史记录
  history.value = history.value.slice(0, historyIndex.value + 1)
  
  // 保存当前状态
  const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
  history.value.push(imageData)
  historyIndex.value++
}

// 撤销
const undo = () => {
  if (!canUndo.value || !canvas.value) return
  
  historyIndex.value--
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  ctx.putImageData(history.value[historyIndex.value], 0, 0)
}

// 处理触摸事件
const handleTouchStart = (event: TouchEvent) => {
  event.preventDefault()
  const touch = event.touches[0]
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  startDrawing(mouseEvent)
}

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault()
  const touch = event.touches[0]
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  draw(mouseEvent)
}

// 重置图片
const resetImage = () => {
  if (currentImage.value) {
    URL.revokeObjectURL(currentImage.value)
  }
  currentImage.value = ''
  history.value = []
  historyIndex.value = -1
}

// 下载图片
const downloadImage = () => {
  if (!canvas.value) return

  const link = document.createElement('a')
  link.download = 'mosaic_image.png'
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