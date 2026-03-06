<script setup lang="ts">
import { ChevronDown, SlidersHorizontal } from 'lucide-vue-next';

import Button from '@/common/ui/Button.vue';

interface Props {
  open: boolean;
}

defineProps<Props>();

defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <div class="filters-toggle">
    <Button variant="ghost" @click="$emit('toggle')">
      <SlidersHorizontal :size="16" />

      Filters

      <ChevronDown :size="16" class="arrow" :class="{ open }" />
    </Button>
  </div>
</template>

<style scoped>
.filters-toggle {
  display: flex;
}

.arrow {
  transition: transform 0.2s;
}

.arrow.open {
  transform: rotate(180deg);
}
</style>
