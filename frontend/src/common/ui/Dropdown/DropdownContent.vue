<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { inject, watchEffect } from 'vue';

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

watchEffect(() => {
  if (dropdown.open.value) update();
});

if (window.visualViewport) {
  useEventListener(window.visualViewport, 'resize', update);
  useEventListener(window.visualViewport, 'scroll', update);
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="dropdown.open.value"
      :ref="(el) => (dropdown.contentRef.value = el as HTMLElement)"
      class="dropdown-content"
      :style="{
        top: `${top}px`,
        left: `${left}px`,
        minWidth: minWidth ? `${minWidth}px` : undefined,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined
      }"
    >
      <slot />
    </div>
  </Teleport>
</template>

<style scoped>
.dropdown-content {
  position: fixed;

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

  z-index: 1000;

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.02);
}
</style>
