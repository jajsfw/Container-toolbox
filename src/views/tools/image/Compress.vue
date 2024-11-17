<template>
  <div class="space-y-6">
    <div class="bg-white shadow-sm rounded-lg">
      <!-- 工具标题 -->
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          图片压缩
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          支持JPG、PNG、WebP等格式,最大20MB
        </p>
      </div>

      <!-- 上传区域 -->
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div class="space-y-1 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="flex text-sm text-gray-600">
              <label class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>上传图片</span>
                <input type="file" class="sr-only" accept="image/*" multiple @change="handleFileUpload">
              </label>
              <p class="pl-1">或拖拽图片到这里</p>
            </div>
            <p class="text-xs text-gray-500">
              PNG, JPG, GIF 最大 20MB
            </p>
          </div>
        </div>

        <!-- 压缩选项 -->
        <div class="mt-6">
          <h4 class="text-sm font-medium text-gray-900">压缩选项</h4>
          <div class="mt-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">质量</label>
              <input type="range" min="0" max="100" v-model="quality" class="mt-1 w-full">
              <div class="mt-1 text-sm text-gray-500">{{ quality }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button type="button" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          开始压缩
        </button>
      </div>
    </div>

    <!-- 文件列表 -->
    <div class="mt-6">
      <div class="space-y-4">
        <div v-for="file in files" :key="file.id" 
             class="bg-white p-4 rounded-lg shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <img :src="file.preview" class="w-16 h-16 object-cover rounded" />
              <div>
                <div class="font-medium">{{ file.file.name }}</div>
                <div class="text-sm text-gray-500">
                  {{ (file.file.size / 1024 / 1024).toFixed(2) }}MB
                </div>
                <div v-if="file.compressed" class="text-sm text-green-600">
                  压缩率: {{ getCompressionRate(file.file.size, file.compressed.size) }}%
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button v-if="file.status === 'done'"
                      @click="downloadFile(file)"
                      class="text-blue-600 hover:text-blue-700">
                下载
              </button>
              <button @click="removeFile(file)"
                      class="text-red-600 hover:text-red-700">
                删除
              </button>
            </div>
          </div>
          
          <!-- 状态显示 -->
          <div class="mt-2">
            <div v-if="file.status === 'processing'" 
                 class="text-yellow-600">
              处理中...
            </div>
            <div v-else-if="file.status === 'error'" 
                 class="text-red-600">
              {{ file.error || '处理失败' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-end space-x-4">
      <button @click="startCompress"
              :disabled="isProcessing || files.length === 0"
              class="inline-flex justify-center py-2 px-4 border border-transparent 
                     shadow-sm text-sm font-medium rounded-md text-white 
                     bg-blue-600 hover:bg-blue-700 focus:outline-none 
                     focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed">
        {{ isProcessing ? '处理中...' : '开始压缩' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { compressImage } from '../../../utils/imageCompressor'

interface FileItem {
  id: string
  file: File
  preview: string
  status: 'waiting' | 'processing' | 'done' | 'error'
  compressed?: File
  error?: string
}

const quality = ref(80)
const files = ref<FileItem[]>([])
const isProcessing = ref(false)

// 处理文件上传
const handleFileUpload = async (event: Event) => {
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

// 压缩单个文件
const compressFile = async (fileItem: FileItem) => {
  try {
    fileItem.status = 'processing'
    const compressed = await compressImage(fileItem.file, {
      quality: quality.value / 100
    })
    fileItem.compressed = compressed
    fileItem.status = 'done'
    return compressed
  } catch (error) {
    fileItem.status = 'error'
    fileItem.error = (error as Error).message
    throw error
  }
}

// 开始压缩所有文件
const startCompress = async () => {
  if (isProcessing.value) return
  isProcessing.value = true

  try {
    await Promise.all(
      files.value
        .filter(f => f.status === 'waiting')
        .map(f => compressFile(f))
    )
  } finally {
    isProcessing.value = false
  }
}

// 下载压缩后的文件
const downloadFile = (fileItem: FileItem) => {
  if (!fileItem.compressed) return
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(fileItem.compressed)
  link.download = `compressed_${fileItem.file.name}`
  link.click()
}

// 删除文件
const removeFile = (fileItem: FileItem) => {
  const index = files.value.findIndex(f => f.id === fileItem.id)
  if (index > -1) {
    URL.revokeObjectURL(fileItem.preview)
    files.value.splice(index, 1)
  }
}

// 计算压缩率
const getCompressionRate = (original: number, compressed: number) => {
  return Math.round((1 - compressed / original) * 100)
}
</script> 