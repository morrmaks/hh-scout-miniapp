<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  height?: number | string;
  radius?: number | string;
  width?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '16px',
  radius: '6px'
});

function size(v: number | string) {
  return typeof v === 'number' ? `${v}px` : v;
}

const style = computed(() => ({
  width: size(props.width),
  height: size(props.height),
  borderRadius: size(props.radius)
}));
</script>

<template>
  <div class="skeleton" :style="style" aria-hidden="true" />
</template>

<style scoped>
.skeleton {
  position: relative;
  overflow: hidden;
  background: var(--bg-soft);
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translate3d(-100%, 0, 0);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
  animation: shimmer 1.2s infinite;
  will-change: transform;
}

@keyframes shimmer {
  100% {
    transform: translate3d(100%, 0, 0);
  }
}
</style>
