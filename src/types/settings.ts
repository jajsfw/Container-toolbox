export interface HotkeyConfig {
  name: string
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  description: string
}

export const defaultHotkeys: HotkeyConfig[] = [
  {
    name: 'toggleTheme',
    key: 'd',
    ctrl: true,
    description: '切换深色/浅色模式'
  },
  {
    name: 'openSettings',
    key: ',',
    ctrl: true,
    description: '打开设置'
  },
  {
    name: 'search',
    key: 'k',
    ctrl: true,
    description: '搜索工具'
  }
] 