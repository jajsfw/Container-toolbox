import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: [
      'vue-router',
      'pinia',
      'crypto-js',
      'prettier',
      'browser-image-compression'
    ]
  }
}) 