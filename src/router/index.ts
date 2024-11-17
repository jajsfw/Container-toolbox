import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import type { RouteLocationNormalized, Position } from 'vue-router'
import Home from '../views/Home.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/image',
    component: () => import('../views/tools/ImageTools.vue'),
    children: [
      {
        path: '',
        redirect: 'compress'
      },
      {
        path: 'compress',
        component: () => import('../views/tools/image/Compress.vue')
      },
      {
        path: 'convert',
        component: () => import('../views/tools/image/Convert.vue')
      },
      {
        path: 'crop',
        component: () => import('../views/tools/image/Crop.vue')
      },
      {
        path: 'filter',
        component: () => import('../views/tools/image/Filter.vue')
      },
      {
        path: 'watermark',
        component: () => import('../views/tools/image/Watermark.vue')
      },
      {
        path: 'resize',
        component: () => import('../views/tools/image/Resize.vue')
      },
      {
        path: 'merge',
        component: () => import('../views/tools/image/Merge.vue')
      },
      {
        path: 'puzzle',
        component: () => import('../views/tools/image/Puzzle.vue')
      },
      {
        path: 'mosaic',
        component: () => import('../views/tools/image/Mosaic.vue')
      },
      {
        path: 'effects',
        component: () => import('../views/tools/image/Effects.vue')
      }
    ]
  },
  {
    path: '/video',
    component: () => import('../views/tools/VideoTools.vue'),
    children: [
      {
        path: '',
        redirect: 'compress'
      },
      {
        path: 'compress',
        component: () => import('../views/tools/video/Compress.vue')
      }
    ]
  },
  {
    path: '/code',
    component: () => import('../views/tools/CodeTools.vue'),
    children: [
      {
        path: '',
        redirect: 'formatter'
      },
      {
        path: 'formatter',
        component: () => import('../views/tools/code/Formatter.vue')
      },
      {
        path: 'regex',
        component: () => import('../views/tools/code/RegexTester.vue')
      }
    ]
  },
  {
    path: '/crypto',
    component: () => import('../views/tools/CryptoTools.vue'),
    children: [
      {
        path: '',
        redirect: 'hash'
      },
      {
        path: 'hash',
        component: () => import('../views/tools/crypto/Hash.vue')
      },
      {
        path: 'text',
        component: () => import('../views/tools/crypto/TextCrypto.vue')
      },
      {
        path: 'base64',
        component: () => import('../views/tools/crypto/Base64.vue')
      },
      {
        path: 'url',
        component: () => import('../views/tools/crypto/URLCrypto.vue')
      },
      {
        path: 'jwt',
        component: () => import('../views/tools/crypto/JWTParser.vue')
      },
      {
        path: 'password',
        component: () => import('../views/tools/crypto/PasswordGenerator.vue')
      },
      {
        path: 'timestamp',
        component: () => import('../views/tools/crypto/TimestampConverter.vue')
      },
      {
        path: 'unicode',
        component: () => import('../views/tools/crypto/UnicodeConverter.vue')
      }
    ]
  },
  {
    path: '/qrcode',
    component: () => import('../views/tools/QRCodeTools.vue'),
    children: [
      {
        path: '',
        redirect: 'generate'
      },
      {
        path: 'generate',
        component: () => import('../views/tools/qrcode/QRCode.vue')
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    savedPosition: Position | null
  ) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router 