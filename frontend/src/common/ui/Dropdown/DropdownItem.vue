<script setup lang="ts">
import { inject } from 'vue';

import { dropdownKey } from './dropdown.context';

interface Props {
  asChild?: boolean;
}

defineProps<Props>();
defineSlots<{
  default: (props: { close: () => void }) => any;
}>();

const dropdown = inject(dropdownKey)!;
</script>

<template>
  <slot v-if="asChild" :close="dropdown.close" />

  <div v-else class="item" @click="dropdown.close">
    <slot :close="dropdown.close" />
  </div>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.item:hover {
  background: var(--bg-soft);
}
</style>
