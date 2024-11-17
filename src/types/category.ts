export interface Category {
  id: string
  name: string
  icon: any // 这里可以根据需要定义更具体的图标类型
  description: string
}

export const categories: Category[] = [
  {
    id: 'image',
    name: '图片工具',
    icon: 'ImageIcon',
    description: '图片压缩、格式转换、编辑等'
  },
  {
    id: 'video',
    name: '视频工具',
    icon: 'VideoIcon',
    description: '视频压缩、格式转换、剪辑等'
  },
  {
    id: 'code',
    name: '代码工具',
    icon: 'CodeIcon',
    description: '代码格式化、压缩、对比等'
  },
  {
    id: 'crypto',
    name: '加密工具',
    icon: 'CryptoIcon',
    description: '加密解密、哈希计算等'
  },
  {
    id: 'convert',
    name: '格式转换',
    icon: 'ConvertIcon',
    description: '文件格式转换工具'
  },
  {
    id: 'tools',
    name: '实用工具',
    icon: 'ToolsIcon',
    description: '二维码、时间戳等工具'
  }
] 