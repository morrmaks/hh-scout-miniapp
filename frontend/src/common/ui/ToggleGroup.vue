<script setup lang="ts" generic="T extends string | number">
import { computed } from 'vue';

import Button from './Button.vue';

interface Option<T> {
  label: string;
  value: T;
}

interface Props<T> {
  mode?: 'multiple' | 'single';
  modelValue?: T | T[];
  options: Option<T>[];
  variant?: 'ghost' | 'outline';
}

const props = withDefaults(defineProps<Props<T>>(), {
  mode: 'multiple',
  variant: 'ghost'
});

const emit = defineEmits<{
  'update:modelValue': [T | T[]];
}>();

const selected = computed(() => {
  if (props.mode === 'single') {
    const value = props.modelValue as T | undefined;
    return new Set(value ? [value] : []);
  }

  const values = props.modelValue as T[] | undefined;
  return new Set(values ?? []);
});

function toggle(value: T) {
  if (props.mode === 'single') {
    emit('update:modelValue', value);
    return;
  }

  const current = Array.isArray(props.modelValue) ? props.modelValue : [];

  const next = new Set(current);

  if (next.has(value)) next.delete(value);
  else next.add(value);

  emit('update:modelValue', Array.from(next));
}
</script>

<template>
  <div class="group">
    <Button
      v-for="o in options"
      :key="o.value"
      :variant="variant"
      size="sm"
      :active="selected.has(o.value)"
      @click="toggle(o.value)"
    >
      {{ o.label }}
    </Button>
  </div>
</template>

<style scoped>
.group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
