<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="close">
      <TransitionChild
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 dark:bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                设置
              </DialogTitle>

              <div class="mt-6 space-y-6">
                <!-- 主题设置 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    主题
                  </label>
                  <div class="mt-2">
                    <select
                      v-model="store.preferences.theme"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                    >
                      <option value="light">浅色</option>
                      <option value="dark">深色</option>
                      <option value="system">跟随系统</option>
                    </select>
                  </div>
                </div>

                <!-- 动画设置 -->
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">启用动画</span>
                  <Switch
                    v-model="store.preferences.animations"
                    class="relative inline-flex h-6 w-11 items-center rounded-full"
                    :class="[store.preferences.animations ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600']"
                  >
                    <span class="sr-only">启用动画</span>
                    <span
                      class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                      :class="[store.preferences.animations ? 'translate-x-6' : 'translate-x-1']"
                    />
                  </Switch>
                </div>

                <!-- 默认压缩质量 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    默认压缩质量
                  </label>
                  <div class="mt-2">
                    <input
                      type="range"
                      v-model="store.preferences.defaultQuality"
                      class="w-full"
                      min="0"
                      max="100"
                      step="1"
                    >
                    <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {{ store.preferences.defaultQuality }}%
                    </div>
                  </div>
                </div>

                <!-- 最大文件大小 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    最大文件大小
                  </label>
                  <div class="mt-2">
                    <input
                      type="number"
                      v-model="store.preferences.maxFileSize"
                      class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                      min="1"
                      max="100"
                    >
                    <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      MB
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  class="btn-secondary"
                  @click="close"
                >
                  关闭
                </button>
                <button
                  type="button"
                  class="btn"
                  @click="saveAndClose"
                >
                  保存
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Switch } from '@headlessui/vue'
import { useAppStore } from '../stores/app'

const store = useAppStore()
const isOpen = ref(false)

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
}

const saveAndClose = () => {
  store.updateTheme()
  close()
}

defineExpose({
  open
})
</script> 