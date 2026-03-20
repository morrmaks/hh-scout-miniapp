<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { provide } from 'vue';

import { DrawerContextKey } from './drawer.context';

interface Props {
  open?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [boolean];
}>();

const open = useVModel(props, 'open', emit, {
  passive: true,
  defaultValue: false
});

function setOpen(value: boolean) {
  open.value = value;
}

function toggle() {
  open.value = !open.value;
}

provide(DrawerContextKey, {
  open,
  setOpen,
  toggle
});
</script>

<template>
  <slot />
</template>
