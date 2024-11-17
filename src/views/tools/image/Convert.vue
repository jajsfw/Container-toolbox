<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          图片格式转换
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          支持多种格式互转，包括 JPG、PNG、WebP、AVIF 等
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
                支持 JPG、PNG、WebP、AVIF 格式
              </p>
            </div>
            <input type="file" class="sr-only" accept="image/*" multiple @change="handleFileSelect">
          </label>
        </div>

        <!-- 转换选项 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              目标格式
            </label>
            <select
              v-model="targetFormat"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="image/jpeg">JPG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
              <option value="image/avif">AVIF</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              质量
            </label>
            <input
              type="range"
              v-model="quality"
              min="0"
              max="100"
              class="mt-1 block w-full"
            >
            <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ quality }}%
            </div>
          </div>
        </div>

        <!-- 文件列表 -->
        <div class="space-y-4">
          <div
            v-for="file in files"
            :key="file.id"
            class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <img :src="file.preview" class="h-16 w-16 object-cover rounded-lg">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ file.file.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatFileSize(file.file.size) }}
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button
                  v-if="file.converted"
                  @click="downloadFile(file)"
                  class="text-blue-600 hover:text-blue-500"
                >
                  下载
                </button>
                <button
                  @click="removeFile(file)"
                  class="text-red-600 hover:text-red-500"
                >
                  删除
                </button>
              </div>
            </div>

            <!-- 转换状态 -->
            <div class="mt-2">
              <div v-if="file.status === 'converting'" class="text-yellow-600 dark:text-yellow-500">
                转换中...
              </div>
              <div v-else-if="file.status === 'error'" class="text-red-600">
                {{ file.error }}
              </div>
              <div v-else-if="file.status === 'done'" class="text-green-600">
                转换完成
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-4">
          <button
            @click="startConvert"
            :disabled="!canConvert"
            class="btn"
          >
            开始转换
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ConvertFile {
  id: string
  file: File
  preview: string
  status: 'waiting' | 'converting' | 'done' | 'error'
  converted?: Blob
  error?: string
}

const files = ref<ConvertFile[]>([])
const targetFormat = ref('image/webp')
const quality = ref(80)

const canConvert = computed(() => {
  return files.value.length > 0 && !files.value.some(f => f.status === 'converting')
})

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const newFiles = Array.from(input.files).map(file => ({
    id: Math.random().toString(36).slice(2),
    file,
    preview: URL.createObjectURL(file),
    status: 'waiting' as const
  }))

  files.value.push(...newFiles)
}

// 转换单个文件
const convertFile = async (file: ConvertFile) => {
  try {
    file.status = 'converting'
    
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = file.preview
    })
    
    canvas.width = img.width
    canvas.height = img.height
    ctx?.drawImage(img, 0, 0)
    
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('转换失败')),
        targetFormat.value,
        quality.value / 100
      )
    })
    
    file.converted = blob
    file.status = 'done'
  } catch (err) {
    file.status = 'error'
    file.error = (err as Error).message
  }
}

// 开始转换所有文件
const startConvert = async () => {
  await Promise.all(
    files.value
      .filter(f => f.status === 'waiting')
      .map(f => convertFile(f))
  )
}

// 下载转换后的文件
const downloadFile = (file: ConvertFile) => {
  if (!file.converted) return
  
  const link = document.createElement('a')
  const ext = targetFormat.value.split('/')[1]
  link.download = `${file.file.name.split('.')[0]}.${ext}`
  link.href = URL.createObjectURL(file.converted)
  link.click()
}

// 移除文件
const removeFile = (file: ConvertFile) => {
  const index = files.value.findIndex(f => f.id === file.id)
  if (index > -1) {
    URL.revokeObjectURL(file.preview)
    if (file.converted) {
      URL.revokeObjectURL(URL.createObjectURL(file.converted))
    }
    files.value.splice(index, 1)
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}
</script> 