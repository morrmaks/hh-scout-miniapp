<script setup lang="ts">
import { computed } from 'vue';

import type { Toast } from '@/modules/toast/types/toaster.types';

import { useToasterStore } from '../store/toaster.store';
import ToastItem from './ToastItem.vue';

const { toasts } = useToasterStore();

const groups = computed(() => {
  const result: Record<string, Toast[]> = {};

  for (const toast of toasts.value) {
    const pos = toast.position || 'bottom-right';

    if (!result[pos]) result[pos] = [];

    result[pos].unshift(toast);
  }

  return result;
});
</script>

<template>
  <div v-for="pos in Object.keys(groups)" :key="pos" class="toast-container" :class="pos">
    <ToastItem
      v-for="(toast, i) in groups[pos]"
      :key="toast.id"
      :toast="toast"
      :order="(groups[pos]?.length ?? 0) - i - 1"
    />
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  width: 320px;
  height: 0;
  z-index: 9999;
}

/* DESKTOP POSITIONS */

.top-left {
  top: 20px;
  left: 20px;
}

.top-center {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.top-right {
  top: 20px;
  right: 20px;
}

.bottom-left {
  bottom: 20px;
  left: 20px;
}

.bottom-center {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.bottom-right {
  bottom: 20px;
  right: 20px;
}

.left-top {
  left: 20px;
  top: 20px;
}

.left-bottom {
  left: 20px;
  bottom: 20px;
}

.right-top {
  right: 20px;
  top: 20px;
}

.right-bottom {
  right: 20px;
  bottom: 20px;
}

@media (max-width: 600px) {
  .toast-container {
    width: calc(100% - 32px);
    left: 0;
    right: 0;
    padding: 0 12px;
    margin: 0 auto;
  }

  .top-center,
  .bottom-center {
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
