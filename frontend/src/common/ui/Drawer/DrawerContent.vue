<script setup lang="ts">
import { useEventListener, useScrollLock } from '@vueuse/core';
import { inject, ref, watch } from 'vue';

import { DrawerContextKey } from './drawer.context';

const ctx = inject(DrawerContextKey);

if (!ctx) {
  throw new Error('DrawerContent must be used inside Drawer');
}

const bodyScrollLock = useScrollLock(document.body);

const visible = ref(false);
const state = ref<'closed' | 'open'>('closed');

const drawerRef = ref<HTMLElement | null>(null);

const startY = ref(0);
const dragging = ref(false);
let offset = 0;

const CLOSE_THRESHOLD = 120;
const DRAG_DAMPING = 0.6;

watch(
  () => ctx.open.value,
  (open) => {
    bodyScrollLock.value = open;

    if (open) {
      visible.value = true;

      requestAnimationFrame(() => {
        state.value = 'open';
      });
    } else {
      state.value = 'closed';
    }
  },
  { immediate: true }
);

function close() {
  ctx?.setOpen(false);
}

function setTransform(y: number) {
  const el = drawerRef.value;
  if (!el) return;

  el.style.transform = `translate3d(0, ${y}px, 0)`;
}

function resetTransform() {
  drawerRef.value?.style.removeProperty('transform');
}

function onAnimationEnd(e: AnimationEvent) {
  if (e.target !== drawerRef.value) return;
  if (state.value === 'closed') visible.value = false;
}

function onPointerDown(e: PointerEvent) {
  dragging.value = true;
  startY.value = e.clientY;
  drawerRef.value?.classList.add('dragging');
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return;

  const diff = e.clientY - startY.value;

  if (diff <= 0) return;

  offset = diff * DRAG_DAMPING;
  setTransform(offset);
}

function onPointerUp() {
  if (!dragging.value) return;

  dragging.value = false;
  drawerRef.value?.classList.remove('dragging');

  if (offset > CLOSE_THRESHOLD) close();
  else resetTransform();

  offset = 0;
}

useEventListener(window, 'pointermove', onPointerMove);
useEventListener(window, ['pointerup', 'pointercancel'], onPointerUp);
useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') close();
});
</script>

<template>
  <Teleport to="body">
    <template v-if="visible">
      <div class="overlay" :data-state="state" @click="close" @animationend="onAnimationEnd" />

      <div
        ref="drawerRef"
        class="drawer"
        data-drawer
        data-direction="bottom"
        :data-state="state"
        @animationend="onAnimationEnd"
      >
        <div class="handle-area" @pointerdown="onPointerDown">
          <div class="handle" />
        </div>

        <slot />
      </div>
    </template>
  </Teleport>
</template>

<style scoped>
.drawer {
  position: fixed;
  inset: auto 0 0 0;
  z-index: 50;

  background: var(--card);
  border-radius: 20px 20px 0 0;

  max-height: 80vh;
  overflow-y: auto;

  padding: 0 20px 20px;

  touch-action: auto;
  will-change: transform;
  overscroll-behavior: contain;
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);

  animation-duration: 0.25s;
  animation-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
}

.drawer.dragging {
  animation: none;
  transition: none;
}

.drawer[data-state='open'] {
  animation-name: slideFromBottom;
}

.drawer[data-state='closed'] {
  animation-name: slideToBottom;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 40;

  background: rgba(0, 0, 0, 0.45);

  animation-duration: 0.25s;
  animation-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
}

.overlay[data-state='open'] {
  animation-name: fadeIn;
}

.overlay[data-state='closed'] {
  animation-name: fadeOut;
}

.handle-area {
  display: flex;
  justify-content: center;
  padding: 20px 0 12px;
  touch-action: none;
}

.handle {
  width: 36px;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
}

@keyframes slideFromBottom {
  from {
    transform: translate3d(0, 100%, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes slideToBottom {
  to {
    transform: translate3d(0, 100%, 0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
  }
}
</style>
