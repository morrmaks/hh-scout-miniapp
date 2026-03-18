<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { inject, ref, watch } from 'vue';

import { useFloatingPosition } from '@/common/composables/useFloatingPosition';
import { useLockScrollParents } from '@/common/composables/useLockScrollParents';

import { dropdownKey } from './dropdown.context';

const dropdown = inject(dropdownKey)!;

const { top, left, maxHeight, minWidth, update } = useFloatingPosition(
  dropdown.triggerRef,
  dropdown.contentRef,
  dropdown.open
);

useLockScrollParents(dropdown.triggerRef, dropdown.open);

/* ---------------- state ---------------- */

const visible = ref(false);
const state = ref<'closed' | 'open'>('closed');

watch(
  () => dropdown.open.value,
  (open) => {
    if (open) {
      visible.value = true;

      requestAnimationFrame(() => {
        state.value = 'open';
        update();
      });

      return;
    }

    state.value = 'closed';
  },
  { immediate: true }
);

function onAnimationEnd(e: AnimationEvent) {
  if (e.target !== dropdown.contentRef.value) return;
  if (state.value === 'closed') visible.value = false;
}

/* ---------------- viewport ---------------- */

if (window.visualViewport) {
  useEventListener(window.visualViewport, 'resize', update);
  useEventListener(window.visualViewport, 'scroll', update);
}

useEventListener(window, 'scroll', update, { passive: true });
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      :ref="(el) => (dropdown.contentRef.value = el as HTMLElement)"
      :data-state="state"
      class="dropdown-content"
      :style="{
        top: `${top}px`,
        left: `${left}px`,
        minWidth: minWidth ? `${minWidth}px` : undefined,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined
      }"
      @animationend="onAnimationEnd"
    >
      <slot :close="dropdown.close" />
    </div>
  </Teleport>
</template>

<style scoped>
.dropdown-content {
  position: fixed;
  z-index: 1000;

  display: flex;
  flex-direction: column;
  gap: 4px;

  min-width: 80px;
  max-width: calc(100vw - 16px);

  padding: 4px;

  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;

  overflow-y: auto;
  overflow-x: hidden;

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.02);

  animation-duration: 0.2s;
  animation-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
}

/* open */

.dropdown-content[data-state='open'] {
  animation-name: dropdownIn;
}

/* close */

.dropdown-content[data-state='closed'] {
  animation-name: dropdownOut;
}

/* animations */

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes dropdownOut {
  to {
    opacity: 0;
    transform: translateY(-6px) scale(0.96);
  }
}
</style>
