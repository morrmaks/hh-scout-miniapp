<script setup lang="ts">
import type { Job } from '@/common/api/generated';

import Button from '@/common/ui/Button.vue';

interface Props {
  job: Job | null;
  position: string;
}

defineProps<Props>();

defineEmits<{
  prev: [];
  next: [];
}>();
</script>

<template>
  <div v-if="job" class="viewer">
    <header class="header">
      <div class="title-block">
        <h2 class="title">
          {{ job.title }}
        </h2>
        <p class="company">
          {{ job.company }}
        </p>
      </div>

      <div class="position">
        {{ position }}
      </div>
    </header>

    <article class="description">
      {{ job.description }}
    </article>

    <div class="nav">
      <Button variant="ghost" @click="$emit('prev')"> ← </Button>

      <Button variant="ghost" @click="$emit('next')"> → </Button>

      <a :href="job.url" target="_blank">
        <Button> Open </Button>
      </a>
    </div>
  </div>

  <div v-else class="empty">Start searching jobs</div>
</template>

<style scoped>
.viewer {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;

  padding: 24px;

  display: flex;
  flex-direction: column;

  height: 60vh;

  gap: 18px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.position {
  font-size: 13px;
  color: var(--text-muted);
  background: var(--bg-soft);
  padding: 4px 8px;
  border-radius: 6px;
}

.title {
  font-size: 22px;
  font-weight: 600;
}

.company {
  font-size: 14px;
  color: var(--text-muted);
}

.description {
  flex: 1;
  overflow-y: auto;

  font-size: 15px;
  line-height: 1.6;

  background: var(--bg-soft);
  padding: 16px;

  border-radius: 10px;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.empty {
  text-align: center;
  color: var(--text-muted);
}
</style>
