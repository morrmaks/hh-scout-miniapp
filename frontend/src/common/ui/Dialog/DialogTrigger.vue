<script setup lang="ts">
import { inject } from 'vue';

import { DialogContextKey } from './dialog.context';

const ctx = inject(DialogContextKey);
if (!ctx) throw new Error('DialogTrigger must be inside Dialog');
</script>

<template>
  <div @click="ctx.toggle">
    <slot />
  </div>
</template>
