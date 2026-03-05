<script setup lang="ts">
interface Props {
  disabled?: boolean;
  modelValue?: string;
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [string];
  enter: [];
}>();

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <input
    class="input"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    @input="onInput"
    @keydown.enter="$emit('enter')"
  />
</template>

<style scoped>
input {
  flex: 1;

  background: var(--bg-soft);

  border: 1px solid var(--border);

  border-radius: 10px;

  padding: 10px 14px;

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
