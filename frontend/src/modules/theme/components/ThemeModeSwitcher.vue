<script setup lang="ts">
import { computed } from 'vue';

import { ToggleGroup, ToggleGroupItem } from '@/common/ui/ToggleGroup';
import { useThemeStore } from '@/modules/theme';

const store = useThemeStore();

const themeOptions = [
  { label: 'Системная', value: 'system' },
  { label: 'Светлая', value: 'light' },
  { label: 'Тёмная', value: 'dark' }
];

const mode = computed({
  get: () => store.mode,
  set: (v) => store.setMode(v)
});
</script>

<template>
  <ToggleGroup v-model="mode" mode="single">
    <ToggleGroupItem v-for="o in themeOptions" :key="o.value" :value="o.value" variant="outline">
      {{ o.label }}
    </ToggleGroupItem>
  </ToggleGroup>
</template>

<style scoped></style>
