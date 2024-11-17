import { onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'

interface HotkeyConfig {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: () => void
}

export function useHotkeys(hotkeys: HotkeyConfig[]) {
  const store = useAppStore()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!store.preferences.animations) return

    for (const hotkey of hotkeys) {
      if (
        event.key.toLowerCase() === hotkey.key.toLowerCase() &&
        !!event.ctrlKey === !!hotkey.ctrl &&
        !!event.shiftKey === !!hotkey.shift &&
        !!event.altKey === !!hotkey.alt
      ) {
        event.preventDefault()
        hotkey.handler()
        break
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
} 