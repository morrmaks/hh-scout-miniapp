<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';

import { tooltipKey } from './tooltip.context';

const ctx = inject(tooltipKey);
if (!ctx) throw new Error('TooltipTrigger must be inside Tooltip');

const el = ref<HTMLElement | null>(null);

onMounted(() => {
  const element = (el.value as any)?.$el ?? el.value;
  if (!element) return;

  ctx.triggerRef.value = element;
});

const shouldIntercept = computed(() => !ctx.disabled);
</script>

<template>
  <span ref="el" class="trigger">
    <slot />

    <span
      v-if="shouldIntercept"
      class="overlay"
      aria-hidden="true"
      role="presentation"
      @mouseenter="!ctx.isMobile() && ctx.openTooltip()"
      @mouseleave="!ctx.isMobile() && ctx.closeTooltip()"
      @click="ctx.isMobile() && ctx.toggleMobile()"
    />
  </span>
</template>

<style scoped>
.trigger {
  position: relative;
  display: inline-flex;
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: transparent;
  pointer-events: auto;
}
</style>
