<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { provide, ref, watch } from 'vue';

import { dropdownKey } from './dropdown.context';

const props = defineProps<{
  open?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:open': [boolean];
}>();

const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

/* controlled state */

const open = ref(props.open ?? false);

watch(
  () => props.open,
  (v) => {
    if (props.disabled) return;
    if (v !== undefined) open.value = v;
  }
);

watch(open, (v) => {
  emit('update:open', v);
});

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
}

function close() {
  open.value = false;
}

provide(dropdownKey, {
  open,
  toggle,
  close,
  triggerRef,
  contentRef,
  disabled: !!props.disabled
});

function onPointerDown(e: PointerEvent) {
  const target = e.target as Node;

  const isInsideTrigger = triggerRef.value?.contains(target);
  const isInsideContent = contentRef.value?.contains(target);

  if (isInsideTrigger || isInsideContent) return;

  close();
}

useEventListener(window, 'pointerdown', onPointerDown);

useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') close();
});
</script>

<template>
  <div class="dropdown">
    <slot />
  </div>
</template>

<style scoped>
.dropdown {
  display: inline-block;
  pointer-events: auto;
}
</style>
