<script setup lang="ts">
import { Check } from 'lucide-vue-next';

interface Props {
  label?: string;
  modelValue?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [boolean];
}>();

function toggle(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
}
</script>

<template>
  <label class="checkbox">
    <input type="checkbox" :checked="modelValue" @change="toggle" />

    <span class="box">
      <Check v-if="modelValue" :size="12" />
    </span>

    <span class="text">
      {{ label }}
    </span>
  </label>
</template>

<style scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;

  cursor: pointer;
}

.checkbox input {
  display: none;
}

.box {
  width: 18px;
  height: 18px;

  border: 1px solid var(--border);
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  color: var(--text);

  background: transparent;

  transition: all 0.15s;
}

.checkbox input:checked + .box {
  background: var(--primary);
  border-color: var(--primary);
}

.text {
  font-size: 14px;
  color: var(--text);
}
</style>
