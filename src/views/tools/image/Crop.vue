<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
      <div class="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
          图片裁剪
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          自由裁剪图片大小和比例
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

        <!-- 裁剪区域 -->
        <div v-else class="space-y-4">
          <div class="relative overflow-hidden rounded-lg" ref="cropperContainer">
            <vue-cropper
              ref="cropper"
              :src="currentImage"
              :aspect-ratio="aspectRatio"
              :view-mode="2"
              :guides="true"
              :background="true"
              :rotatable="true"
              :scalable="true"
              :zoomable="true"
              :modal="true"
              :auto-crop-area="0.8"
              class="max-h-[600px]"
            />
          </div>

          <!-- 裁剪控制 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                裁剪比例
              </label>
              <select
                v-model="selectedRatio"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              >
                <option value="free">自由裁剪</option>
                <option value="1">1:1 (正方形)</option>
                <option value="4/3">4:3 (标准)</option>
                <option value="16/9">16:9 (宽屏)</option>
                <option value="2/3">2:3 (竖屏)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                旋转角度
              </label>
              <div class="mt-1 flex items-center space-x-2">
                <button
                  @click="rotate(-90)"
                  class="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <button
                  @click="rotate(90)"
                  class="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-end space-x-4">
            <button
              @click="resetImage"
              class="btn-secondary"
            >
              重新选择
            </button>
            <button
              @click="cropImage"
              class="btn"
            >
              裁剪并下载
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

const currentImage = ref<string>('')
const cropper = ref<any>(null)
const selectedRatio = ref('free')

const aspectRatio = computed(() => {
  if (selectedRatio.value === 'free') return NaN
  return eval(selectedRatio.value)
})

// 监听比例变化
watch(selectedRatio, () => {
  if (cropper.value) {
    cropper.value.setAspectRatio(aspectRatio.value)
  }
})

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  currentImage.value = URL.createObjectURL(file)
}

// 旋转图片
const rotate = (deg: number) => {
  if (cropper.value) {
    cropper.value.rotate(deg)
  }
}

// 重置图片
const resetImage = () => {
  if (currentImage.value) {
    URL.revokeObjectURL(currentImage.value)
  }
  currentImage.value = ''
  selectedRatio.value = 'free'
}

// 裁剪并下载图片
const cropImage = () => {
  if (!cropper.value) return

  const canvas = cropper.value.getCroppedCanvas()
  if (!canvas) return

  canvas.toBlob((blob: Blob) => {
    const link = document.createElement('a')
    link.download = 'cropped_image.png'
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  })
}
</script> 