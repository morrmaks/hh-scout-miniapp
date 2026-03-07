<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  type: 'text'
});

const emit = defineEmits<{
  'update:modelValue': [string];
  enter: [];
}>();

interface Props {
  disabled?: boolean;
  modelValue?: string;
  placeholder?: string;
  type?: string;
}

const attrs = useAttrs();

const inputRef = ref<HTMLInputElement | null>(null);

const value = computed({
  get: () => props.modelValue,
  set: (v: string) => emit('update:modelValue', v)
});

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
});
</script>

<template>
  <input
    ref="inputRef"
    v-model="value"
    class="input"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    v-bind="attrs"
    @keydown.enter="$emit('enter')"
  />
</template>

<style scoped>
.input {
  flex: 1;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 14px;
  color: var(--text);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
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
