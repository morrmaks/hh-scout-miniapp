<script setup lang="ts">
import { onClickOutside, useEventListener } from '@vueuse/core';
import { provide, ref, watch } from 'vue';

import { dropdownKey } from './dropdown.context';

const props = defineProps<{
  open?: boolean;
}>();

const emit = defineEmits<{
  'update:open': [boolean];
}>();

const root = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

/* controlled state */

const open = ref(props.open ?? false);

watch(
  () => props.open,
  (v) => {
    if (v !== undefined) open.value = v;
  }
);

watch(open, (v) => {
  emit('update:open', v);
});

function toggle() {
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
  contentRef
});

onClickOutside(root, close, {
  ignore: [contentRef]
});

useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') close();
});
</script>

<template>
  <div ref="root" class="dropdown">
    <slot />
  </div>
</template>

<style scoped>
.dropdown {
  display: inline-block;
}
</style>
