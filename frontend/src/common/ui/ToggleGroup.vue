<script setup lang="ts">
interface Option {
  label: string;
  value: string;
}

interface Props {
  modelValue?: string[];
  options: Option[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [string[]];
}>();

function toggle(value: string) {
  const current = props.modelValue ?? [];

  if (current.includes(value)) {
    emit(
      'update:modelValue',
      current.filter((v) => v !== value)
    );
  } else {
    emit('update:modelValue', [...current, value]);
  }
}
</script>

<template>
  <div class="group">
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      class="item"
      :class="{ active: modelValue?.includes(o.value) }"
      @click="toggle(o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>

<style scoped>
.group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.item {
  padding: 6px 12px;

  border: 1px solid var(--border);
  border-radius: 8px;

  background: var(--button-bg);
  color: var(--text);

  font-size: 13px;
  cursor: pointer;

  transition: all 0.15s ease;
}

.item:hover {
  background: var(--button-hover);
}

.item.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}
</style>
