<script setup lang="ts" generic="T extends string | number">
import { computed } from 'vue';

interface Tab<T> {
  icon?: any;
  label: string;
  value: T;
}

interface Props<T> {
  modelValue?: T;
  tabs: Tab<T>[];
}

const props = defineProps<Props<T>>();

const emit = defineEmits<{
  'update:modelValue': [T];
}>();

const active = computed(() => props.modelValue);

function select(value: T) {
  if (value === props.modelValue) return;
  emit('update:modelValue', value);
}
</script>

<template>
  <div class="tabs">
    <button
      v-for="t in tabs"
      :key="t.value"
      class="tab"
      :class="{ active: active === t.value }"
      @click="select(t.value)"
    >
      <component :is="t.icon" v-if="t.icon" class="icon" :size="16" />

      <span>{{ t.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 8px;
}

.tab {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 10px;

  border-radius: 8px;
  border: 1px solid var(--border);

  background: var(--button-bg);

  font-size: 13px;
}

.tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.icon {
  opacity: 0.9;
}
</style>
