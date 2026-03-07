<script setup lang="ts">
import { computed } from 'vue';

import Button from './Button.vue';

interface Option {
  label: string;
  value: string;
}

interface Props {
  modelValue?: string[];
  options: Option[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
});

const emit = defineEmits<{
  'update:modelValue': [string[]];
}>();

const selected = computed(() => new Set(props.modelValue));

function toggle(value: string) {
  const next = new Set(props.modelValue);

  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }

  emit('update:modelValue', Array.from(next));
}
</script>

<template>
  <div class="group">
    <Button
      v-for="o in options"
      :key="o.value"
      variant="ghost"
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
