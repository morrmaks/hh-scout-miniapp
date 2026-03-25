<script setup lang="ts">
import { inject, useAttrs } from 'vue';

import { DrawerContextKey } from './drawer.context';

defineOptions({ inheritAttrs: false });
defineProps<{ asChild?: boolean }>();
const ctx = inject(DrawerContextKey);
if (!ctx) throw new Error('DrawerTrigger must be used inside Drawer');

const attrs = useAttrs();

function onClick() {
  ctx?.toggle();
}
</script>

<template>
  <span class="anchor" v-bind="attrs" @click="onClick">
    <slot />
  </span>
</template>

<style scoped>
.anchor {
  display: inline-block;
}
</style>
