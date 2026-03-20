<script setup lang="ts">
import { computed } from 'vue';

import type { Area } from '@/common/api/generated';

import { ToggleGroup, ToggleGroupCollapse, ToggleGroupItem } from '@/common/ui/ToggleGroup';

interface Props {
  areas: Area[];
  modelValue?: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [string[]];
}>();

const value = computed({
  get: () => props.modelValue ?? [],
  set: (v) => emit('update:modelValue', v)
});
</script>

<template>
  <ToggleGroup v-model="value">
    <ToggleGroupCollapse :limit="5">
      <ToggleGroupItem v-for="area in areas" :key="area.id" :value="area.id">
        {{ area.name }}
      </ToggleGroupItem>
    </ToggleGroupCollapse>
  </ToggleGroup>
</template>
