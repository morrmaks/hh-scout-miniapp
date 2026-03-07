<script setup lang="ts">
import { useEventListener, useScrollLock } from '@vueuse/core';
import { computed, ref, watch } from 'vue';

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [boolean];
}>();

const startY = ref(0);
const currentY = ref(0);
const dragging = ref(false);

const CLOSE_THRESHOLD = 120;

const bodyScrollLock = useScrollLock(document.body);

watch(
  () => props.open,
  (v) => {
    bodyScrollLock.value = v;
  }
);

function close() {
  emit('update:open', false);
}

/* pointer drag */

function onPointerDown(e: PointerEvent) {
  dragging.value = true;
  startY.value = e.clientY;
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return;

  const diff = e.clientY - startY.value;
  currentY.value = diff > 0 ? diff : 0;
}

function onPointerUp() {
  if (!dragging.value) return;

  if (currentY.value > CLOSE_THRESHOLD) close();

  dragging.value = false;
  currentY.value = 0;
}

/* keyboard */

useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape') close();
});

const style = computed(() => {
  if (!dragging.value) return {};
  return { transform: `translateY(${currentY.value}px)` };
});
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="drawer">
        <div class="overlay" @click="close" />

        <div
          class="content"
          :style="style"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <div class="handle" />

          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer {
  position: fixed;
  inset: 0;
  z-index: 50;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--card);
  border-radius: 20px 20px 0 0;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  transition: transform 0.2s ease;
  touch-action: none;
}

.handle {
  width: 36px;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin: 0 auto 16px;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .content,
.drawer-leave-active .content {
  transition: transform 0.25s ease;
}

.drawer-enter-from .content {
  transform: translateY(100%);
}

.drawer-leave-to .content {
  transform: translateY(100%);
}
</style>
