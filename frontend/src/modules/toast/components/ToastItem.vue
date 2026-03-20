<script setup lang="ts">
import { CircleCheck, OctagonX, TriangleAlert, X } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';

import Button from '@/common/ui/Button.vue';

import type { Toast } from '../types/toaster.types';

import { useToastDrag } from '../composables/useToastDrag';
import { useToasterStore } from '../store/toaster.store';

const props = defineProps<{
  toast: Toast;
  order: number;
}>();

const toaster = useToasterStore();

const toastRef = ref<HTMLElement | null>(null);

const close = () => {
  toaster.close(props.toast.id);
};

const { onPointerDown } = useToastDrag(toastRef, close);

const state = computed(() => props.toast.state || 'open');

const direction = computed(() => {
  const pos = props.toast.position || 'bottom-right';

  if (pos.startsWith('top')) return 'from-top';
  if (pos.startsWith('bottom')) return 'from-bottom';
  if (pos.startsWith('left')) return 'from-left';
  if (pos.startsWith('right')) return 'from-right';

  return 'from-bottom';
});

const icon = computed(() => {
  switch (props.toast.variant) {
    case 'success':
      return CircleCheck;
    case 'error':
      return OctagonX;
    case 'warning':
      return TriangleAlert;
    default:
      return null;
  }
});

const stackDirection = computed(() => {
  const pos = props.toast.position || 'bottom-right';
  return pos.includes('top') ? -1 : 1;
});

const mounted = ref(false);

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true;
  });
});
</script>

<template>
  <div class="toast-wrapper" :class="direction" :data-state="mounted ? state : 'init'">
    <div
      ref="toastRef"
      class="toast"
      :class="toast.variant"
      :style="{
        '--stack-offset': `${stackDirection * order * 8}px`,
        '--stack-scale': 1 - order * 0.05,
        opacity: order > 2 ? 0 : 1,
        zIndex: 100 + order
      }"
      @pointerdown="onPointerDown"
    >
      <Button class="close" variant="link" @pointerdown.stop @click.stop="close">
        <X :size="14" />
      </Button>

      <div class="content">
        <component :is="icon" v-if="icon" class="icon" :size="16" />

        <div class="text">
          <div v-if="toast.title" class="title">
            {{ toast.title }}
          </div>

          <div class="message">
            {{ toast.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* wrapper */

.toast-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  opacity: 0;
  translate: 0 12px;

  transition:
    opacity 0.6s cubic-bezier(0.32, 0.72, 0, 1),
    translate 0.6s ease;
}
/* OPEN */
.toast-wrapper.from-top[data-state='init'] {
  opacity: 0;
  translate: 0 -100px;
}

.toast-wrapper.from-bottom[data-state='init'] {
  opacity: 0;
  translate: 0 100px;
}

.toast-wrapper.from-left[data-state='init'] {
  opacity: 0;
  translate: -120px 0;
}

.toast-wrapper.from-right[data-state='init'] {
  opacity: 0;
  translate: 120px 0;
}

.toast-wrapper[data-state='open'] {
  translate: 0 0;
  opacity: 1;
}

.toast-wrapper.from-top[data-state='open'] {
  translate: 0 0;
  opacity: 1;
}

.toast-wrapper.from-top[data-state='closing'] {
  translate: 0 -20px;
  opacity: 0;
}

.toast-wrapper.from-bottom[data-state='open'] {
  translate: 0 0;
  opacity: 1;
}

.toast-wrapper.from-bottom[data-state='closing'] {
  translate: 0 20px;
  opacity: 0;
}

.toast-wrapper.from-left[data-state='closing'] {
  translate: -24px 0;
  opacity: 0;
}

.toast-wrapper.from-right[data-state='closing'] {
  translate: 24px 0;
  opacity: 0;
}

.bottom-left .toast-wrapper,
.bottom-center .toast-wrapper,
.bottom-right .toast-wrapper,
.left-bottom .toast-wrapper,
.right-bottom .toast-wrapper {
  top: auto;
  bottom: 0;
}

.top-left .toast-wrapper,
.top-center .toast-wrapper,
.top-right .toast-wrapper,
.left-top .toast-wrapper,
.right-top .toast-wrapper {
  top: 0;
}

/* toast */

.toast {
  position: relative;

  min-width: 260px;
  padding: 14px 16px;

  border-radius: 10px;
  border: 1px solid var(--border);

  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.25);
  background: var(--card);
  color: var(--text);

  touch-action: none;
  will-change: transform;
  transform: translateY(var(--stack-offset)) scale(var(--stack-scale)) translateX(var(--drag-x, 0));
  transition:
    transform 0.4s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.4s;
}

.toast.dragging {
  transition: none;
  cursor: grabbing;
}

/* layout */

.content {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.close {
  position: absolute;
  right: 2px;
  top: 2px;

  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
}

.title {
  font-size: 16px;
}

.message {
  font-size: 14px;
}

/* variants */
.toast.success {
  background: var(--toast-success-bg);
  color: var(--toast-success-text);
  border: 1px solid var(--toast-success-border);
}

.toast.error {
  background: var(--toast-error-bg);
  color: var(--toast-error-text);
  border: 1px solid var(--toast-error-border);
}

.toast.warning {
  background: var(--toast-warning-bg);
  color: var(--toast-warning-text);
  border: 1px solid var(--toast-warning-border);
}

@media (max-width: 600px) {
  .toast-container[class*='top'] .toast-wrapper.from-left[data-state='init'],
  .toast-container[class*='top'] .toast-wrapper.from-right[data-state='init'] {
    translate: 0 -100px;
  }

  .toast-container[class*='top'] .toast-wrapper.from-left[data-state='closing'],
  .toast-container[class*='top'] .toast-wrapper.from-right[data-state='closing'] {
    translate: 0 -20px;
  }

  .toast-container[class*='bottom'] .toast-wrapper.from-left[data-state='init'],
  .toast-container[class*='bottom'] .toast-wrapper.from-right[data-state='init'] {
    translate: 0 100px;
  }

  .toast-container[class*='bottom'] .toast-wrapper.from-left[data-state='closing'],
  .toast-container[class*='bottom'] .toast-wrapper.from-right[data-state='closing'] {
    translate: 0 20px;
  }
}
</style>
