import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { RemovableRef } from '@vueuse/core'

export interface Preferences {
  theme: 'light' | 'dark' | 'system'
  defaultQuality: number
  maxFileSize: number
  language: string
  animations: boolean
}

export interface AppState {
  recentFiles: string[]
  preferences: RemovableRef<Preferences>
}

const defaultPreferences: Preferences = {
  theme: 'system',
  defaultQuality: 80,
  maxFileSize: 20,
  language: 'zh-CN',
  animations: true
}

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    recentFiles: [],
    preferences: useStorage('it-toolbox-preferences', defaultPreferences)
  }),

  getters: {
    isDark(): boolean {
      if (this.preferences.theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      return this.preferences.theme === 'dark'
    }
  },

  actions: {
    addRecentFile(path: string) {
      if (!this.recentFiles.includes(path)) {
        this.recentFiles.unshift(path)
        if (this.recentFiles.length > 10) {
          this.recentFiles.pop()
        }
      }
    },

    setTheme(theme: Preferences['theme']) {
      this.preferences.theme = theme
      this.updateTheme()
    },

    updateTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    toggleAnimations() {
      this.preferences.animations = !this.preferences.animations
      document.documentElement.classList.toggle('reduce-motion', !this.preferences.animations)
    },

    resetPreferences() {
      this.preferences = { ...defaultPreferences }
    }
  },

  persist: {
    key: 'it-toolbox-app',
    storage: localStorage,
    paths: ['preferences']
  }
}) 