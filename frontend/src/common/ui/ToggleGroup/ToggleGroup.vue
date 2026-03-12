<script setup lang="ts" generic="T extends string | number">
import { computed, provide, shallowRef } from 'vue';

import type { ToggleGroupContext } from './toggleGroup.context';

import { toggleGroupKey } from './toggleGroup.context';

type Mode = 'multiple' | 'single';

const props = withDefaults(
  defineProps<{
    modelValue?: T | T[];
    mode?: Mode;
  }>(),
  {
    mode: 'multiple'
  }
);

const emit = defineEmits<{
  'update:modelValue': [T | T[]];
}>();

/* registry */

const items = shallowRef<T[]>([]);

function register(value: T) {
  if (items.value.includes(value)) return;
  items.value = [...items.value, value];
}

/* selection */

const selected = computed(() => {
  if (props.mode === 'single') {
    const value = props.modelValue as T | undefined;
    return new Set(value ? [value] : []);
  }

  const values = Array.isArray(props.modelValue) ? props.modelValue : [];
  return new Set(values);
});

/* toggle */

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

const context: ToggleGroupContext<T> = {
  selected,
  toggle,
  register,
  items
};

provide(toggleGroupKey, context);
</script>

<template>
  <div class="group">
    <slot />
  </div>
</template>

<style scoped>
.group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
