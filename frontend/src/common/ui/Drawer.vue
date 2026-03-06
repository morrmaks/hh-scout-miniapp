<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface Props {
  open: boolean;
}

const { open } = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [boolean];
}>();

const startY = ref(0);
const currentY = ref(0);
const dragging = ref(false);

function close() {
  emit('update:open', false);
}

function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0];
  if (!touch) return;

  dragging.value = true;
  startY.value = touch.clientY;
}

function onTouchMove(e: TouchEvent) {
  if (!dragging.value) return;

  const touch = e.touches[0];
  if (!touch) return;

  currentY.value = touch.clientY - startY.value;
}

function onTouchEnd() {
  if (!dragging.value) return;

  if (currentY.value > 120) {
    close();
  }

  dragging.value = false;
  currentY.value = 0;
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close();
}

onMounted(() => {
  window.addEventListener('keydown', onKey);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onKey);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="drawer">
      <div class="overlay" @click="close" />

      <div
        class="content"
        :style="{
          transform: dragging ? `translateY(${currentY}px)` : ''
        }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div class="handle" />

        <slot />
      </div>
    </div>
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

  animation: drawerIn 0.25s ease;
}

.handle {
  width: 36px;
  height: 4px;

  background: var(--border);

  border-radius: 2px;

  margin: 0 auto 16px auto;
}

@keyframes drawerIn {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
