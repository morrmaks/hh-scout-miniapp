<script setup lang="ts">
import type { Job } from '@/common/api/generated';

defineProps<{
  job: Job;
}>();
</script>

<template>
  <div class="item">
    <div class="header">
      <h3>{{ job.title }}</h3>
      <span class="company">{{ job.company }}</span>
    </div>

    <div class="meta">
      <span v-if="job.city">
        {{ job.city }}
      </span>

      <span v-if="job.salaryFrom || job.salaryTo">
        {{ job.salaryFrom ?? 0 }}
        {{ job.salaryTo ? ` - ${job.salaryTo}` : '' }}
        {{ job.currency }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.item {
  padding: 16px;

  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;

  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.company {
  color: var(--text-muted);
  font-size: 14px;
}

.meta {
  font-size: 13px;
  color: var(--text-muted);

  display: flex;
  gap: 12px;
}
</style>
