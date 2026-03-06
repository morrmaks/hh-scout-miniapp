<script setup lang="ts">
interface Props {
  modelValue?: number;
  placeholder?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [number];
}>();

function input(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', Number(target.value));
}
</script>

<template>
  <input
    type="number"
    class="input"
    :value="modelValue"
    :placeholder="placeholder"
    @input="input"
  />
</template>

<style scoped>
input {
  width: 120px;
  flex: 1;
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--text);
  transition: all 0.15s ease;
}

input::placeholder {
  color: var(--text-muted);
}

input:focus {
  outline: none;

  border-color: var(--primary);

  box-shadow:
    0 0 0 1px var(--primary),
    0 0 14px rgba(59, 130, 246, 0.25);
}
</style>
