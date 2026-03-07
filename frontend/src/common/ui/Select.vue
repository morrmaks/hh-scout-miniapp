<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { computed, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [number | string];
}>();

interface Option {
  label: string;
  value: number | string;
}

interface Props {
  modelValue?: number | string;
  options: Option[];
}

const attrs = useAttrs();

const value = computed({
  get: () => props.modelValue,
  set: (v: string) => {
    const option = props.options.find((o) => String(o.value) === v);

    if (!option) return;

    emit('update:modelValue', option.value);
  }
});
</script>

<template>
  <div class="select-wrapper">
    <select v-model="value" class="select" v-bind="attrs">
      <option v-for="o in options" :key="o.value" :value="o.value">
        {{ o.label }}
      </option>
    </select>

    <ChevronDown class="icon" :size="14" />
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
  cursor: pointer;
}

.icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.select:focus {
  outline: none;
  border-color: var(--primary);
}

.select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
