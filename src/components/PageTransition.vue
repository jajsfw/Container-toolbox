<template>
  <transition
    name="page"
    mode="out-in"
    appear
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <slot></slot>
  </transition>
</template>

<script setup lang="ts">
const beforeEnter = (el: Element) => {
  (el as HTMLElement).style.opacity = '0'
  ;(el as HTMLElement).style.transform = 'scale(0.98) translateY(10px)'
}

const enter = (el: Element, done: () => void) => {
  requestAnimationFrame(() => {
    (el as HTMLElement).style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    ;(el as HTMLElement).style.opacity = '1'
    ;(el as HTMLElement).style.transform = 'scale(1) translateY(0)'
    el.addEventListener('transitionend', done, { once: true })
  })
}

const afterEnter = (el: Element) => {
  (el as HTMLElement).style.transition = ''
}

const beforeLeave = (el: Element) => {
  (el as HTMLElement).style.opacity = '1'
  ;(el as HTMLElement).style.transform = 'scale(1) translateY(0)'
}

const leave = (el: Element, done: () => void) => {
  requestAnimationFrame(() => {
    (el as HTMLElement).style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    ;(el as HTMLElement).style.opacity = '0'
    ;(el as HTMLElement).style.transform = 'scale(0.98) translateY(10px)'
    el.addEventListener('transitionend', done, { once: true })
  })
}

const afterLeave = (el: Element) => {
  (el as HTMLElement).style.transition = ''
}
</script> 