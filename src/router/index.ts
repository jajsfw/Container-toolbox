import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
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

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router 