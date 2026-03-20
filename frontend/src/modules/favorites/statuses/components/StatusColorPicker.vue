<script setup lang="ts">
import type { StatusColor } from '@/common/api/generated';

import { STATUS_COLOR_MAP, STATUS_COLORS } from '../constants/statusColors';

defineProps<{ modelValue: StatusColor }>();

const emit = defineEmits<{
  (e: 'update:modelValue', color: StatusColor): void;
}>();
</script>

<template>
  <div class="colors">
    <button
      v-for="c in STATUS_COLORS"
      :key="c"
      class="color"
      :class="{ active: c === modelValue }"
      :style="{ background: STATUS_COLOR_MAP[c] }"
      @click="emit('update:modelValue', c)"
    />
  </div>
</template>

<style scoped>
.colors {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  place-items: center;
}

.color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}

.color.active {
  box-shadow: 0 0 0 2px var(--primary);
}
</style>
