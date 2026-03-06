<script setup lang="ts">
interface Props {
  height?: string;
  radius?: string;
  width?: string;
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '16px',
  radius: '6px'
});
</script>

<template>
  <div
    class="skeleton"
    :style="{
      width,
      height,
      borderRadius: radius
    }"
  />
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

  transform: translateX(-100%);

  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);

  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
