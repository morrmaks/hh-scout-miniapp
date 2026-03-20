<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  color?: 'glow' | 'soft';
  height?: number | string;
  radius?: number | string;
  width?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '16px',
  radius: '6px',
  color: 'soft'
});

function size(v: number | string) {
  return typeof v === 'number' ? `${v}px` : v;
}

const style = computed(() => ({
  width: size(props.width),
  height: size(props.height),
  background: props.color === 'glow' ? 'var(--skeleton-glow)' : 'var(--bg-soft)',
  '--skeleton-radius': size(props.radius)
}));
</script>

<template>
  <div class="skeleton" :style="style" aria-hidden="true" v-bind="$attrs" />
</template>

<style scoped>
.skeleton {
  position: relative;
  overflow: hidden;

  border-radius: var(--skeleton-radius);

  animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes skeleton-pulse {
  50% {
    opacity: 0.5;
  }
}
</style>
