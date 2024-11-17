<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          图片特效
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          添加艺术特效，支持多种预设效果
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

        <!-- 图片预览和特效控制 -->
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
            <!-- 特效选择 -->
            <div class="grid grid-cols-2 gap-4">
              <button
                v-for="effect in effects"
                :key="effect.id"
                @click="applyEffect(effect.id)"
                class="p-4 rounded-lg text-center transition-all duration-200"
                :class="[
                  selectedEffect === effect.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                ]"
              >
                <div class="text-sm font-medium">{{ effect.name }}</div>
              </button>
            </div>

            <!-- 特效强度 -->
            <div v-if="selectedEffect">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                效果强度
              </label>
              <input
                type="range"
                v-model.number="effectStrength"
                min="0"
                max="100"
                class="mt-1 block w-full"
                @input="applyEffect(selectedEffect)"
              >
              <div class="mt-1 text-sm text-gray-500">{{ effectStrength }}%</div>
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
import { ref, onMounted, onUnmounted } from 'vue'

const effects = [
  { id: 'oil', name: '油画' },
  { id: 'sketch', name: '素描' },
  { id: 'pixelate', name: '像素化' },
  { id: 'emboss', name: '浮雕' },
  { id: 'cartoon', name: '卡通' },
  { id: 'neon', name: '霓虹' },
  { id: 'vignette', name: '暗角' },
  { id: 'glitch', name: '故障' }
]

const currentImage = ref<string>('')
const canvas = ref<HTMLCanvasElement | null>(null)
const selectedEffect = ref('')
const effectStrength = ref(50)
const originalImageData = ref<ImageData | null>(null)

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

    // 保存原始图像数据
    originalImageData.value = ctx.getImageData(0, 0, containerWidth, scaledHeight)
  }
  img.src = currentImage.value
}

// 应用特效
const applyEffect = (effectId: string) => {
  if (!canvas.value || !originalImageData.value) return
  
  selectedEffect.value = effectId
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // 恢复原始图像
  ctx.putImageData(originalImageData.value, 0, 0)
  
  // 获取图像数据
  const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
  const data = imageData.data
  const strength = effectStrength.value / 100

  // 应用不同特效
  switch (effectId) {
    case 'oil':
      applyOilPaintingEffect(data, canvas.value.width, canvas.value.height, strength)
      break
    case 'sketch':
      applySketchEffect(data, canvas.value.width, canvas.value.height, strength)
      break
    case 'pixelate':
      applyPixelateEffect(ctx, strength)
      return // 像素化效果直接在 ctx 上操作
    case 'emboss':
      applyEmbossEffect(data, canvas.value.width, canvas.value.height, strength)
      break
    case 'cartoon':
      applyCartoonEffect(data, canvas.value.width, canvas.value.height, strength)
      break
    case 'neon':
      applyNeonEffect(data, canvas.value.width, canvas.value.height, strength)
      break
    case 'vignette':
      applyVignetteEffect(ctx, strength)
      return // 暗角效果直接在 ctx 上操作
    case 'glitch':
      applyGlitchEffect(data, canvas.value.width, canvas.value.height, strength)
      break
  }

  // 更新 canvas
  ctx.putImageData(imageData, 0, 0)
}

// 特效实现函数
const applyOilPaintingEffect = (data: Uint8ClampedArray, width: number, height: number, strength: number) => {
  const radius = Math.floor(4 * strength)
  const intensity = Math.floor(30 * strength)
  const intensityLevels: number[] = new Array(intensity).fill(0)
  const rgbLevels: [number[], number[], number[]] = [
    new Array(intensity).fill(0),
    new Array(intensity).fill(0),
    new Array(intensity).fill(0)
  ]

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = (y * width + x) * 4
      intensityLevels.fill(0)
      rgbLevels.forEach(channel => channel.fill(0))
      let maxIntensity = 0
      let maxIndex = 0

      for (let ry = -radius; ry <= radius; ry++) {
        for (let rx = -radius; rx <= radius; rx++) {
          const nx = x + rx
          const ny = y + ry
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const npos = (ny * width + nx) * 4
            const avg = Math.floor(
              (data[npos] + data[npos + 1] + data[npos + 2]) / 3
            )
            const index = Math.floor((avg * intensity) / 255)
            intensityLevels[index]++
            rgbLevels[0][index] += data[npos]
            rgbLevels[1][index] += data[npos + 1]
            rgbLevels[2][index] += data[npos + 2]

            if (intensityLevels[index] > maxIntensity) {
              maxIntensity = intensityLevels[index]
              maxIndex = index
            }
          }
        }
      }

      data[pos] = Math.floor(rgbLevels[0][maxIndex] / maxIntensity)
      data[pos + 1] = Math.floor(rgbLevels[1][maxIndex] / maxIntensity)
      data[pos + 2] = Math.floor(rgbLevels[2][maxIndex] / maxIntensity)
    }
  }
}

const applySketchEffect = (data: Uint8ClampedArray, width: number, height: number, strength: number) => {
  // 素描效果实现
  for (let i = 0; i < data.length; i += 4) {
    const gray = (data[i] + data[i + 1] + data[i + 2]) / 3
    const sketch = 255 - gray * strength
    data[i] = data[i + 1] = data[i + 2] = sketch
  }
}

const applyPixelateEffect = (ctx: CanvasRenderingContext2D, strength: number) => {
  // 像素化效果实现
  const size = Math.max(2, Math.floor(20 * strength))
  const w = ctx.canvas.width
  const h = ctx.canvas.height

  ctx.imageSmoothingEnabled = false
  
  // 创建临时 canvas
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return

  tempCanvas.width = w
  tempCanvas.height = h
  
  // 缩小并放大图像以创建像素化效果
  tempCtx.drawImage(ctx.canvas, 0, 0, w / size, h / size)
  ctx.drawImage(tempCanvas, 0, 0, w / size, h / size, 0, 0, w, h)
}

const applyCartoonEffect = (data: Uint8ClampedArray, width: number, height: number, strength: number) => {
  // 首先应用边缘检测
  const edgeData = new Uint8ClampedArray(data)
  applySobelFilter(edgeData, width, height)

  // 然后应用颜色量化
  const levels = Math.floor(2 + strength * 6) // 2-8 个颜色级别
  const quantizationFactor = 255 / (levels - 1)

  for (let i = 0; i < data.length; i += 4) {
    // 颜色量化
    data[i] = Math.round(Math.round(data[i] / quantizationFactor) * quantizationFactor)
    data[i + 1] = Math.round(Math.round(data[i + 1] / quantizationFactor) * quantizationFactor)
    data[i + 2] = Math.round(Math.round(data[i + 2] / quantizationFactor) * quantizationFactor)

    // 如果检测到边缘，则加深颜色
    if (edgeData[i] + edgeData[i + 1] + edgeData[i + 2] < 100) {
      data[i] = Math.max(0, data[i] - 50)
      data[i + 1] = Math.max(0, data[i + 1] - 50)
      data[i + 2] = Math.max(0, data[i + 2] - 50)
    }
  }
}

const applyEmbossEffect = (data: Uint8ClampedArray, width: number, height: number, strength: number) => {
  const tempData = new Uint8ClampedArray(data)
  const factor = Math.floor(strength * 5)

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pos = (y * width + x) * 4
      const topLeft = ((y - 1) * width + (x - 1)) * 4

      for (let i = 0; i < 3; i++) {
        const diff = tempData[pos + i] - tempData[topLeft + i]
        data[pos + i] = Math.min(255, Math.max(0, 128 + diff * factor))
      }
      data[pos + 3] = tempData[pos + 3]
    }
  }
}

const applyNeonEffect = (data: Uint8ClampedArray, width: number, height: number, strength: number) => {
  const tempData = new Uint8ClampedArray(data)
  const radius = Math.floor(strength * 2) + 1
  const intensity = strength * 50

  for (let y = radius; y < height - radius; y++) {
    for (let x = radius; x < width - radius; x++) {
      const pos = (y * width + x) * 4
      let r = 0, g = 0, b = 0
      let count = 0

      // 收集周围像素的颜色
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const npos = ((y + dy) * width + (x + dx)) * 4
          r += tempData[npos]
          g += tempData[npos + 1]
          b += tempData[npos + 2]
          count++
        }
      }

      // 计算平均值
      r = r / count
      g = g / count
      b = b / count

      // 增强颜色差异
      data[pos] = Math.min(255, Math.max(0, r + (tempData[pos] - r) * intensity))
      data[pos + 1] = Math.min(255, Math.max(0, g + (tempData[pos + 1] - g) * intensity))
      data[pos + 2] = Math.min(255, Math.max(0, b + (tempData[pos + 2] - b) * intensity))
    }
  }
}

const applyGlitchEffect = (data: Uint8ClampedArray, width: number, height: number, strength: number) => {
  const tempData = new Uint8ClampedArray(data)
  const sliceHeight = Math.max(1, Math.floor(height / 20))
  const offset = Math.floor(strength * width * 0.1)

  for (let y = 0; y < height; y++) {
    const sliceIndex = Math.floor(y / sliceHeight)
    if (Math.random() < strength * 0.3) { // 30% 的条带会产生故障效果
      const glitchOffset = Math.floor(Math.random() * offset * 2 - offset)
      for (let x = 0; x < width; x++) {
        const pos = (y * width + x) * 4
        const sourceX = Math.min(Math.max(x + glitchOffset, 0), width - 1)
        const sourcePos = (y * width + sourceX) * 4

        // RGB 通道偏移
        data[pos] = tempData[sourcePos]
        data[pos + 1] = tempData[sourcePos + 1]
        data[pos + 2] = tempData[sourcePos + 2]
        data[pos + 3] = tempData[sourcePos + 3]

        // 随机添加噪点
        if (Math.random() < strength * 0.1) {
          data[pos] = Math.random() * 255
          data[pos + 1] = Math.random() * 255
          data[pos + 2] = Math.random() * 255
        }
      }
    }
  }
}

// 辅助函数：Sobel 边缘检测
const applySobelFilter = (data: Uint8ClampedArray, width: number, height: number) => {
  const tempData = new Uint8ClampedArray(data)
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pos = (y * width + x) * 4
      let gx = 0, gy = 0

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4
          const factor = sobelX[(ky + 1) * 3 + (kx + 1)]
          gx += (tempData[idx] + tempData[idx + 1] + tempData[idx + 2]) / 3 * factor
        }
      }

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4
          const factor = sobelY[(ky + 1) * 3 + (kx + 1)]
          gy += (tempData[idx] + tempData[idx + 1] + tempData[idx + 2]) / 3 * factor
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy)
      data[pos] = data[pos + 1] = data[pos + 2] = magnitude
    }
  }
}

// 重置图片
const resetImage = () => {
  if (currentImage.value) {
    URL.revokeObjectURL(currentImage.value)
  }
  currentImage.value = ''
  selectedEffect.value = ''
  effectStrength.value = 50
  originalImageData.value = null
}

// 下载图片
const downloadImage = () => {
  if (!canvas.value) return

  const link = document.createElement('a')
  link.download = 'effect_image.png'
  link.href = canvas.value.toDataURL('image/png')
  link.click()
}

// 添加窗口��小变化监听
onMounted(() => {
  window.addEventListener('resize', loadImage)
})

onUnmounted(() => {
  window.removeEventListener('resize', loadImage)
})

// 添加暗角效果
const applyVignetteEffect = (ctx: CanvasRenderingContext2D, strength: number) => {
  const { width, height } = ctx.canvas
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.sqrt(centerX * centerX + centerY * centerY)
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
  
  // 创建从中心到边缘的渐变
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  gradient.addColorStop(0.5, `rgba(0, 0, 0, ${strength * 0.2})`)
  gradient.addColorStop(1, `rgba(0, 0, 0, ${strength * 0.7})`)

  // 保存当前图像
  const imageData = ctx.getImageData(0, 0, width, height)
  
  // 应用暗角效果
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
  
  // 恢复混合模式
  ctx.globalCompositeOperation = 'source-over'
}
</script> 