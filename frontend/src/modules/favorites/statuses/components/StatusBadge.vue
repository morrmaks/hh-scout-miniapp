<script setup lang="ts">
import { computed } from 'vue';

import type { StatusColor } from '@/common/api/generated';

import { STATUS_COLOR_MAP } from '../constants/statusColors';

const props = defineProps<{
  name: string;
  color: StatusColor;
  variant?: 'filled' | 'outline';
}>();

const style = computed(() => {
  const c = STATUS_COLOR_MAP[props.color];

  if (props.variant === 'filled') {
    return {
      background: c,
      color: '#fff'
    };
  }

  return {
    background: `${c}22`,
    color: c,
    borderColor: c
  };
});
</script>

<template>
  <div class="badge" :class="variant" :style="style">
    <span class="label">
      {{ name }}
    </span>
  </div>
</template>

<style scoped>
.badge {
  width: 100%;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;

  display: flex;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;
}

.label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  text-align: center;
}

.badge.outline {
  border: 1px solid;
}

.badge.filled {
  border: none;
}
</style>
