<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          二维码工具
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          生成或解析二维码
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- 模式切换 -->
        <div class="flex space-x-4">
          <button
            @click="mode = 'generate'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="mode === 'generate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
          >
            生成二维码
          </button>
          <button
            @click="mode = 'scan'"
            class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
            :class="mode === 'scan' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'"
          >
            扫描二维码
          </button>
        </div>

        <!-- 生成二维码 -->
        <div v-if="mode === 'generate'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              内容
            </label>
            <textarea
              v-model="content"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              placeholder="输入要生成二维码的内容..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                尺寸
              </label>
              <input
                type="number"
                v-model="size"
                min="100"
                max="1000"
                step="50"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                容错级别
              </label>
              <select
                v-model="errorLevel"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="L">低 (7%)</option>
                <option value="M">中 (15%)</option>
                <option value="Q">较高 (25%)</option>
                <option value="H">高 (30%)</option>
              </select>
            </div>
          </div>

          <!-- 生成的二维码 -->
          <div v-if="qrDataUrl" class="flex flex-col items-center space-y-4">
            <img :src="qrDataUrl" :alt="content" class="max-w-full">
            <button
              @click="downloadQR"
              class="btn"
            >
              下载二维码
            </button>
          </div>
        </div>

        <!-- 扫描二维码 -->
        <div v-else class="space-y-4">
          <div class="flex justify-center">
            <label class="relative cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  <span class="font-medium text-blue-600 hover:text-blue-500">
                    选择图片
                  </span>
                  或拖拽图片到这里
                </div>
                <p class="text-xs text-gray-500">
                  支持 PNG, JPG 格式
                </p>
              </div>
              <input type="file" class="sr-only" accept="image/*" @change="handleFileSelect">
            </label>
          </div>

          <!-- 扫描结果 -->
          <div v-if="scanResult" class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
              扫描结果
            </div>
            <div class="mt-2 text-sm text-gray-900 dark:text-gray-100 break-all">
              {{ scanResult }}
            </div>
            <div class="mt-4 flex justify-end">
              <button
                @click="copyResult"
                class="btn-secondary"
              >
                复制结果
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import QRCode from 'qrcode'
import jsQR from 'jsqr'

const mode = ref<'generate' | 'scan'>('generate')
const content = ref('')
const size = ref(300)
const errorLevel = ref<'L' | 'M' | 'Q' | 'H'>('M')
const qrDataUrl = ref('')
const scanResult = ref('')

// 生成二维码
watch([content, size, errorLevel], async () => {
  if (!content.value) {
    qrDataUrl.value = ''
    return
  }

  try {
    qrDataUrl.value = await QRCode.toDataURL(content.value, {
      width: size.value,
      margin: 1,
      errorCorrectionLevel: errorLevel.value
    })
  } catch (err) {
    console.error('生成二维码失败:', err)
  }
})

// 下载二维码
const downloadQR = () => {
  if (!qrDataUrl.value) return

  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrDataUrl.value
  link.click()
}

// 处理文件选择
const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  const reader = new FileReader()

  reader.onload = async (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        scanResult.value = code.data
      } else {
        scanResult.value = '未检测到二维码'
      }
    }
    img.src = e.target?.result as string
  }

  reader.readAsDataURL(file)
}

// 复制结果
const copyResult = () => {
  navigator.clipboard.writeText(scanResult.value)
}
</script> 