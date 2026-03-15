<script setup lang="ts">
import { inject } from 'vue';

import { DrawerContextKey } from './drawer.context';

const ctx = inject(DrawerContextKey);

if (!ctx) {
  throw new Error('DrawerTrigger must be used inside Drawer');
}

function onClick() {
  ctx?.toggle();
}
</script>

<template>
  <div @click="onClick">
    <slot />
  </div>
</template>
