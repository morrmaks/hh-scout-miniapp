<script setup lang="ts">
import type { ThemeMode } from '@/modules/theme/types/theme.types';

import ToggleGroup from '@/common/ui/ToggleGroup.vue';
import { useThemeStore } from '@/modules/theme';

const store = useThemeStore();

const options = [
  { label: 'Системная', value: 'system' },
  { label: 'Светлая', value: 'light' },
  { label: 'Тёмная', value: 'dark' }
];

function updateMode(value: string | string[]) {
  if (Array.isArray(value)) return;
  store.setMode(value as ThemeMode);
}
</script>

<template>
  <ToggleGroup
    :model-value="store.mode"
    :options="options"
    variant="outline"
    mode="single"
    @update:model-value="updateMode"
  />
</template>

<style scoped></style>
