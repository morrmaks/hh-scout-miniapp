<script setup lang="ts">
import { Loader, LoaderCircle } from 'lucide-vue-next';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: number | string;
    strokeWidth?: number | string;
    variant?: 'bars' | 'circle' | 'default';
    speed?: number;
  }>(),
  {
    size: 32,
    strokeWidth: 4,
    variant: 'default',
    speed: 1
  }
);

const normalize = (v: number | string) => (typeof v === 'number' ? `${v}px` : v);

const duration = computed(() => `${1 / props.speed}s`);

const isLucide = computed(() => props.variant === 'circle' || props.variant === 'bars');

const icon = computed(() => {
  if (props.variant === 'circle') return LoaderCircle;
  if (props.variant === 'bars') return Loader;
  return null;
});

/**
 * 🔥 компенсация толщины для viewBox 50
 * (чтобы совпадало с lucide)
 */
const normalizedStroke = computed(() => {
  if (typeof props.strokeWidth !== 'number') return props.strokeWidth;
  return props.strokeWidth * 1.8;
});
</script>

<template>
  <!-- ✅ DEFAULT -->
  <svg
    v-if="variant === 'default'"
    class="spinner"
    :style="{
      width: normalize(size),
      height: normalize(size),
      '--duration': duration
    }"
    viewBox="0 0 50 50"
  >
    <circle
      class="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      :stroke-width="normalize(normalizedStroke)"
    />
  </svg>

  <!-- ✅ LUCIDE -->
  <component
    :is="icon"
    v-else-if="isLucide"
    class="spinner"
    :size="typeof size === 'number' ? size : undefined"
    :stroke-width="typeof strokeWidth === 'number' ? strokeWidth : undefined"
    :style="{
      width: normalize(size),
      height: normalize(size),
      '--duration': duration
    }"
  />
</template>

<style scoped>
.spinner {
  display: block;
  color: var(--primary);

  animation: rotate var(--duration) linear infinite;
}

/* 🔥 оригинальная плавная анимация */
.path {
  stroke: currentColor;
  stroke-linecap: round;

  stroke-dasharray: 1, 150;

  animation: dash calc(var(--duration) * 1.4) ease-in-out infinite;
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
