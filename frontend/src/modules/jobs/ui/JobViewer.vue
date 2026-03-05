<script setup lang="ts">
import type { Job } from '@/common/api/generated';

import Button from '@/common/ui/Button.vue';

interface Props {
  job: Job | null;
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
      <h2 class="title">
        {{ job.title }}
      </h2>
      <p class="company">
        {{ job.company }}
      </p>
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
  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.company {
  font-size: 14px;
  color: var(--text-muted);
}

.description {
  flex: 1;

  overflow-y: auto;

  font-size: 15px;
  line-height: 1.65;

  background: var(--bg-soft);

  padding: 16px 18px;

  border-radius: 10px;

  color: var(--text);
}

.description::-webkit-scrollbar {
  width: 6px;
}

.description::-webkit-scrollbar-thumb {
  background: var(--scrollbar);
  border-radius: 6px;
}

.description::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-hover);
}

/* кнопки всегда снизу */
.nav {
  flex-shrink: 0;

  display: flex;
  justify-content: center;
  gap: 12px;
}

.empty {
  text-align: center;
  color: var(--text-muted);
}
</style>
