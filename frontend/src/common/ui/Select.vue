<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { ChevronDown } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import Button from './Button.vue';

interface Option {
  icon?: any;
  label: string;
  value: number | string;
}

interface Props {
  disabled?: boolean;
  modelValue?: number | string;
  options: Option[];
  placeholder?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [number | string];
}>();

const open = ref(false);
const root = ref();

onClickOutside(root, () => (open.value = false));

const selected = computed(() => props.options.find((o) => o.value === props.modelValue));

function select(option: Option) {
  emit('update:modelValue', option.value);
  open.value = false;
}

function toggle() {
  if (props.disabled) return;
  open.value = !open.value;
}
</script>

<template>
  <div ref="root" class="select">
    <button class="trigger" :class="{ disabled }" type="button" @click="toggle">
      <span v-if="selected" class="value">
        <component :is="selected.icon" v-if="selected.icon" :size="14" />
        {{ selected.label }}
      </span>

      <span v-else class="placeholder">
        {{ placeholder }}
      </span>

      <ChevronDown class="chevron" :size="14" />
    </button>

    <div v-if="open" class="dropdown">
      <Button
        v-for="o in options"
        :key="o.value"
        variant="ghost"
        class="option"
        :active="o.value === modelValue"
        @click="select(o)"
      >
        <component :is="o.icon" v-if="o.icon" :size="14" />

        {{ o.label }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
.select {
  position: relative;
  width: 100%;
}

.trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: 8px;

  padding: 8px 12px;
  font-size: 14px;
  color: var(--text);

  cursor: pointer;
}

.trigger.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.value {
  display: flex;
  align-items: center;
  gap: 6px;
}

.placeholder {
  color: var(--text-muted);
}

.chevron {
  color: var(--text-muted);
}

.dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 4px;
  z-index: 20;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(255, 255, 255, 0.02);
  animation: dropdown 0.15s ease;
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.option {
  width: 100%;
  display: flex;
  justify-content: start;
}
</style>
