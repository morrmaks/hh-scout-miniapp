<script setup lang="ts">
import { computed, inject } from 'vue';

import { dropdownKey } from './dropdown.context';

interface Props {
  asChild?: boolean;
  closeOnSelect?: boolean;
  variant?: 'destructive' | 'ghost' | 'success';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'ghost',
  closeOnSelect: false
});

defineSlots<{
  default: (props: { close: () => void }) => any;
}>();

const dropdown = inject(dropdownKey)!;

const classes = computed(() => ['item', `item-${props.variant}`]);

function handleClick() {
  if (!props.closeOnSelect) return;
  dropdown.close();
}
</script>

<template>
  <slot v-if="asChild" :close="dropdown.close" />

  <div v-else :class="classes" @click="handleClick">
    <slot :close="dropdown.close" />
  </div>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 14px;
  line-height: normal;
  cursor: pointer;
  white-space: nowrap;

  transition:
    color 0.15s ease,
    background-color 0.15s ease;
}

.item-ghost:hover {
  background: var(--bg-soft);
}

.item-destructive {
  color: var(--destructive-text);
}

.item-destructive:hover {
  color: var(--destructive-text);
  background: var(--destructive-bg);
}

.item-success {
  color: var(--success-text);
}

.item-success:hover {
  color: var(--success-text);
  background: var(--success-bg);
}
</style>
