<template>
  <div class="space-y-6">
    <!-- 搜索栏 -->
    <SearchBox
      v-model="searchQuery"
      placeholder="搜索工具..."
    />

    <!-- 工具分类 -->
    <CategoryTabs
      v-model="selectedCategory"
      :categories="categories"
      :tools="tools"
    />
    
    <!-- 工具卡片网格 -->
    <TransitionGroup
      tag="div"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      enter-active-class="transition duration-500 ease-spring"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-300 ease-spring"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-4"
      move-class="transition-all duration-500 ease-spring"
    >
      <router-link
        v-for="tool in filteredTools"
        :key="tool.id"
        :to="tool.path"
        class="group transform transition-all duration-500 ease-spring hover:scale-102 hover:-translate-y-1"
      >
        <ToolCard :tool="tool" />
      </router-link>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { categories } from '../types/category'
import { 
  ImageIcon, VideoIcon, CodeIcon, CryptoIcon, 
  QRCodeIcon, ConvertIcon, ToolsIcon 
} from '../components/icons'
import SearchBox from '../components/SearchBox.vue'
import CategoryTabs from '../components/CategoryTabs.vue'
import ToolCard from '../components/ToolCard.vue'

const searchQuery = ref('')
const selectedCategory = ref('all')

const tools = [
  {
    id: 'image-compress',
    name: '图片压缩',
    description: '无损压缩图片，支持批量处理',
    path: '/image/compress',
    category: 'image',
    gradientColor: 'bg-gradient-primary',
    tags: ['JPG', 'PNG', 'WebP'],
    icon: ImageIcon
  },
  {
    id: 'video-compress',
    name: '视频压缩',
    description: '视频压缩转码，支持多种格式',
    path: '/video/compress',
    category: 'video',
    gradientColor: 'bg-gradient-success',
    tags: ['MP4', 'AVI', 'MOV'],
    icon: VideoIcon
  },
  {
    id: 'code-formatter',
    name: '代码格式化',
    description: '支持多种语言的代码格式化',
    path: '/code/formatter',
    category: 'code',
    gradientColor: 'bg-gradient-secondary',
    tags: ['HTML', 'CSS', 'JS'],
    icon: CodeIcon
  },
  {
    id: 'crypto-hash',
    name: '哈希计算',
    description: '计算文件或文本的哈希值',
    path: '/crypto/hash',
    category: 'crypto',
    gradientColor: 'bg-gradient-warning',
    tags: ['MD5', 'SHA1', 'SHA256'],
    icon: CryptoIcon
  },
  {
    id: 'crypto-text',
    name: '文本加密',
    description: '支持多种加密算法，包括 AES、DES、3DES 等',
    path: '/crypto/text',
    category: 'crypto',
    gradientColor: 'bg-gradient-warning',
    tags: ['加密', '解密', 'AES'],
    icon: CryptoIcon
  },
  {
    id: 'qrcode',
    name: '二维码工具',
    description: '生成或扫描二维码',
    path: '/qrcode/generate',
    category: 'tools',
    gradientColor: 'bg-gradient-primary',
    tags: ['生成', '扫描', '解析'],
    icon: QRCodeIcon
  },
  {
    id: 'format-convert',
    name: '格式转换',
    description: '文件格式批量转换',
    path: '/convert',
    category: 'convert',
    gradientColor: 'bg-gradient-info',
    tags: ['格式转换', '批量处理'],
    icon: ConvertIcon
  },
  {
    id: 'image-convert',
    name: '图片格式转换',
    description: '支持多种格式互转，包括 JPG、PNG、WebP、AVIF 等',
    path: '/image/convert',
    category: 'image',
    gradientColor: 'bg-gradient-primary',
    tags: ['格式转换', 'WebP', 'AVIF'],
    icon: ImageIcon
  },
  {
    id: 'image-crop',
    name: '图片裁剪',
    description: '自由裁剪图片大小和比例',
    path: '/image/crop',
    category: 'image',
    gradientColor: 'bg-gradient-primary',
    tags: ['裁剪', '旋', '比例'],
    icon: ImageIcon
  },
  {
    id: 'image-filter',
    name: '图片滤镜',
    description: '添加滤镜效果，支持多种预设和自定义调整',
    path: '/image/filter',
    category: 'image',
    gradientColor: 'bg-gradient-primary',
    tags: ['滤镜', '预设', '调色'],
    icon: ImageIcon
  },
  {
    id: 'image-watermark',
    name: '图片水印',
    description: '添加文字或图片水印，支持自定义位置和透明度',
    path: '/image/watermark',
    category: 'image',
    gradientColor: 'bg-gradient-primary',
    tags: ['水印', '文字', '图片'],
    icon: ImageIcon
  },
  {
    id: 'image-resize',
    name: '图片尺寸调整',
    description: '调整图片尺寸，支持按比例缩放',
    path: '/image/resize',
    category: 'image',
    gradientColor: 'bg-gradient-primary',
    tags: ['缩放', '尺寸', '比例'],
    icon: ImageIcon
  },
  {
    id: 'image-merge',
    name: '图片拼接',
    description: '支持多张图片的横向纵向拼接',
    path: '/image/merge',
    category: 'image',
    gradientColor: 'bg-gradient-primary',
    tags: ['拼接', '合并', '排序'],
    icon: ImageIcon
  },
  {
    id: 'image-puzzle',
    name: '图片拼图',
    description: '支持多种拼图布局，可自定义间距和背景',
    path: '/image/puzzle',
    category: 'image',
    gradientColor: 'bg-gradient-primary',
    tags: ['拼图', '布局', '排版'],
    icon: ImageIcon
  },
  {
    id: 'image-mosaic',
    name: '图片马赛克',
    description: '添加马赛克效果，支持自定义区域和程度',
    path: '/image/mosaic',
    category: 'image',
    gradientColor: 'bg-gradient-primary',
    tags: ['马赛克', '涂抹', '隐私'],
    icon: ImageIcon
  },
  {
    id: 'image-effects',
    name: '图片特效',
    description: '添加艺术特效，支持多种预设效果',
    path: '/image/effects',
    category: 'image',
    gradientColor: 'bg-gradient-primary',
    tags: ['特效', '滤镜', '艺术'],
    icon: ImageIcon
  },
  {
    id: 'crypto-base64',
    name: 'Base64 编解码',
    description: '支持文本和文件的 Base64 编码和解码',
    path: '/crypto/base64',
    category: 'crypto',
    gradientColor: 'bg-gradient-warning',
    tags: ['Base64', '编码', '解码'],
    icon: CryptoIcon
  },
  {
    id: 'crypto-url',
    name: 'URL 编解码',
    description: '支持 URL 编码和解码，包括中文字符',
    path: '/crypto/url',
    category: 'crypto',
    gradientColor: 'bg-gradient-warning',
    tags: ['URL', '编码', '解码'],
    icon: CryptoIcon
  },
  {
    id: 'crypto-jwt',
    name: 'JWT 解析',
    description: '解析和验证 JWT Token，支持查看头部、载荷和签名',
    path: '/crypto/jwt',
    category: 'crypto',
    gradientColor: 'bg-gradient-warning',
    tags: ['JWT', '解析', '验证'],
    icon: CryptoIcon
  },
  {
    id: 'crypto-password',
    name: '密码生成器',
    description: '生成安全的随机密码，支持自定义规则',
    path: '/crypto/password',
    category: 'crypto',
    gradientColor: 'bg-gradient-warning',
    tags: ['密码', '生成', '安全'],
    icon: CryptoIcon
  },
  {
    id: 'crypto-timestamp',
    name: '时间戳转换',
    description: '在时间戳和日期时间之间转换，支持多种格式',
    path: '/crypto/timestamp',
    category: 'crypto',
    gradientColor: 'bg-gradient-warning',
    tags: ['时间戳', '转换', '日期'],
    icon: CryptoIcon
  },
  {
    id: 'crypto-unicode',
    name: 'Unicode 编解码',
    description: '支持 Unicode 转义序列和字符之间的转换',
    path: '/crypto/unicode',
    category: 'crypto',
    gradientColor: 'bg-gradient-warning',
    tags: ['Unicode', '编码', '解码'],
    icon: CryptoIcon
  },
  {
    id: 'code-regex',
    name: '正则测试',
    description: '测试和验证正则表达式，支持实时匹配',
    path: '/code/regex',
    category: 'code',
    gradientColor: 'bg-gradient-secondary',
    tags: ['正则', '测试', '匹配'],
    icon: CodeIcon
  }
]

const filteredTools = computed(() => {
  return tools.filter(tool => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesCategory = selectedCategory.value === 'all' || tool.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})
</script>

<style>
/* 弹性动画 */
.ease-spring {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 工具卡片网格动画 */
.v-move {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 悬停缩放比例 */
.hover\:scale-102:hover {
  transform: scale(1.02);
}

/* 确保网格项目在移动时保持其他变换 */
.v-move,
.v-enter-active,
.v-leave-active {
  transition-property: transform, opacity, translate;
}

/* 添加交错动画延 */
.grid > * {
  transition-delay: calc(var(--index) * 50ms);
}

/* 添加阴影过渡 */
.group {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.group:hover {
  z-index: 10;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style> 