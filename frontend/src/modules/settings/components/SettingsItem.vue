<script setup lang="ts">
import type { LucideProps } from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';

import { ChevronRight } from 'lucide-vue-next';

import Button from '@/common/ui/Button.vue';

interface Props {
  icon: FunctionalComponent<LucideProps>;
  title: string;
}

defineProps<Props>();
</script>

<template>
  <Button variant="ghost" size="lg" class="settings-item">
    <div class="left">
      <component :is="icon" :size="18" class="icon" />

      <span class="title">
        {{ title }}
      </span>
    </div>

    <ChevronRight :size="18" class="arrow" />
  </Button>
</template>

<style scoped>
.settings-item {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon {
  color: var(--primary);
  opacity: 0.8;
}

.title {
  font-size: 16px;
}

.arrow {
  color: var(--text-muted);
}
</style>
