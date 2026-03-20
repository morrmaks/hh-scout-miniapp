<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { provide } from 'vue';

import { DialogContextKey } from './dialog.context';

const props = defineProps<{ open?: boolean }>();

const emit = defineEmits<{
  'update:open': [boolean];
}>();

const open = useVModel(props, 'open', emit, {
  passive: true,
  defaultValue: false
});

function setOpen(v: boolean) {
  open.value = v;
}

function toggle() {
  open.value = !open.value;
}

provide(DialogContextKey, { open, setOpen, toggle });
</script>

<template>
  <slot />
</template>
