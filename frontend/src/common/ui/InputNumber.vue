<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: '',
  step: 1,
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [number | null];
}>();

interface Props {
  disabled?: boolean;
  max?: number;
  min?: number;
  modelValue?: number | null;
  placeholder?: string;
  step?: number;
}

const attrs = useAttrs();

const value = computed({
  get: () => props.modelValue ?? '',
  set: (v: number | string) => {
    if (v === '' || v === null) {
      emit('update:modelValue', null);
      return;
    }

    const n = Number(v);

    if (Number.isNaN(n)) return;

    emit('update:modelValue', n);
  }
});
</script>

<template>
  <input
    v-model="value"
    class="input"
    type="number"
    :placeholder="placeholder"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    v-bind="attrs"
  />
</template>

<style scoped>
.input {
  width: 120px;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--text);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

/* убрать стрелки */

.input::-webkit-outer-spin-button,
.input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input[type='number'] {
  -moz-appearance: textfield;
}

.input::placeholder {
  color: var(--text-muted);
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow:
    0 0 0 1px var(--primary),
    0 0 14px var(--primary-hover);
}

.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
