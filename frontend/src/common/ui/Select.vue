<script setup lang="ts">
interface Option {
  label: string;
  value: number | string;
}

interface Props {
  modelValue?: number | string;
  options: Option[];
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [number | string];
}>();

function change(e: Event) {
  const target = e.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="select-wrapper">
    <select class="select" :value="modelValue" @change="change">
      <option value="">Любой</option>

      <option v-for="o in options" :key="o.value" :value="o.value">
        {{ o.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.select-wrapper {
  position: relative;
  width: 100%;
}

.select {
  width: 100%;

  background: var(--bg-soft);

  border: 1px solid var(--border);
  border-radius: 8px;

  padding: 8px 32px 8px 12px;

  color: var(--text);

  font-size: 14px;

  appearance: none;
}

.select-wrapper::after {
  content: '▾';

  position: absolute;
  right: 12px;
  top: 50%;

  transform: translateY(-50%);

  color: var(--text-muted);
  font-size: 12px;

  pointer-events: none;
}
</style>
