<template>
  <div class="space-y-6">
    <div class="bg-white shadow-sm rounded-lg">
      <!-- 工具标题 -->
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          视频压缩
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          支持MP4、AVI、MOV等格式，最大500MB
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
                <span>上传视频</span>
                <input type="file" class="sr-only" accept="video/*" multiple @change="handleFileUpload">
              </label>
              <p class="pl-1">或拖拽视频到这里</p>
            </div>
            <p class="text-xs text-gray-500">
              MP4, AVI, MOV 最大 500MB
            </p>
          </div>
        </div>

        <!-- 压缩选项 -->
        <div class="mt-6 space-y-6">
          <div>
            <h4 class="text-sm font-medium text-gray-900">视频质量</h4>
            <div class="mt-2">
              <select v-model="quality" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option value="high">高质量</option>
                <option value="medium">中等质量</option>
                <option value="low">低质量</option>
              </select>
            </div>
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-900">输出格式</h4>
            <div class="mt-2">
              <select v-model="format" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option value="mp4">MP4</option>
                <option value="webm">WebM</option>
                <option value="mov">MOV</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button 
          type="button" 
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :disabled="isProcessing"
        >
          {{ isProcessing ? '处理中...' : '开始压缩' }}
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
              <video class="w-24 h-16 object-cover rounded bg-gray-100">
                <source :src="file.preview" :type="file.file.type">
              </video>
              <div>
                <div class="font-medium">{{ file.file.name }}</div>
                <div class="text-sm text-gray-500">
                  {{ (file.file.size / 1024 / 1024).toFixed(2) }}MB
                </div>
                <div v-if="file.status === 'processing'" class="text-sm text-yellow-600">
                  处理中...
                </div>
                <div v-else-if="file.status === 'done'" class="text-sm text-green-600">
                  压缩完成
                </div>
                <div v-else-if="file.status === 'error'" class="text-sm text-red-600">
                  {{ file.error }}
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface VideoFile {
  id: string
  file: File
  preview: string
  status: 'waiting' | 'processing' | 'done' | 'error'
  error?: string
}

const quality = ref('medium')
const format = ref('mp4')
const files = ref<VideoFile[]>([])
const isProcessing = ref(false)

const handleFileUpload = (event: Event) => {
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

const removeFile = (file: VideoFile) => {
  const index = files.value.findIndex(f => f.id === file.id)
  if (index > -1) {
    URL.revokeObjectURL(file.preview)
    files.value.splice(index, 1)
  }
}

const downloadFile = (file: VideoFile) => {
  // 实现下载逻辑
}
</script> 