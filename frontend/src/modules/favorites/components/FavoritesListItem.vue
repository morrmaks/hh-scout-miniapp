<script setup lang="ts">
import { Link, Trash2Icon } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import type { Favorite } from '@/common/api/generated';

import Badge from '@/common/ui/Badge.vue';
import Button from '@/common/ui/Button.vue';
import Card from '@/common/ui/Card.vue';

import { StatusSelector, useStatusesStore } from '../statuses';
import { useFavoritesStore } from '../store/favorites.store';

const props = defineProps<{
  job: Favorite;
}>();

const favorites = useFavoritesStore();
const statuses = useStatusesStore();

const expanded = ref(false);

const salary = computed(() => {
  if (!props.job.salaryFrom && !props.job.salaryTo) return null;

  const from = props.job.salaryFrom;
  const to = props.job.salaryTo;
  const currency = props.job.currency ?? '';

  if (from && to) return `${from} – ${to} ${currency}`;
  if (from) return `от ${from} ${currency}`;
  if (to) return `до ${to} ${currency}`;

  return null;
});

function toggleTitle() {
  expanded.value = !expanded.value;
}

function remove() {
  if (!props.job.jobId) return;
  favorites.toggleFavorite(props.job.jobId);
}
</script>

<template>
  <Card class="favorite-card">
    <div class="left">
      <div class="title-row">
        <a :href="job.url" target="_blank" class="link">
          <Link :size="12" />
        </a>

        <h2 class="title" :class="{ expanded }" @click="toggleTitle">
          {{ job.title }}
        </h2>
      </div>

      <div class="company" :class="{ expanded }" @click="toggleTitle">
        {{ job.company }}
      </div>

      <div class="meta">
        <Badge v-if="job.experience">
          {{ job.experience }}
        </Badge>

        <Badge v-if="salary">
          {{ salary }}
        </Badge>
      </div>
    </div>

    <div class="right">
      <Button size="xs" variant="link" class="remove" @click="remove">
        <Trash2Icon :size="12" />
      </Button>

      <StatusSelector
        :statuses="statuses.statuses"
        :model-value="job.statusId"
        @update:model-value="favorites.setStatus(job.jobId!, $event)"
        @create="statuses.createStatus"
        @update="statuses.updateStatus"
        @delete="statuses.deleteStatus"
      />
    </div>
  </Card>
</template>

<style scoped>
.favorite-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;

  padding: 16px;
}

/* LEFT */

.left {
  flex: 1;

  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-row {
  display: flex;
  align-items: center;

  gap: 6px;

  min-width: 0;
}

.title {
  flex: 1;
  min-width: 0;

  font-size: 18px;
  font-weight: 600;

  cursor: pointer;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;

  overflow: hidden;
}

.title.expanded {
  -webkit-line-clamp: unset;
}

.link {
  flex-shrink: 0;

  display: flex;
  align-items: center;

  opacity: 0.6;
}

.link:hover {
  opacity: 1;
}

.company {
  font-size: 14px;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;

  overflow: hidden;
}

.company.expanded {
  -webkit-line-clamp: unset;
}

.meta {
  margin-top: auto;

  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  /* overflow-x: auto;
  overflow-y: hidden;

  flex-wrap: nowrap;
  min-width: 0;

  scrollbar-width: none; */
}
/* 
.meta::-webkit-scrollbar {
  display: none;
}

.meta > * {
  flex-shrink: 0;
} */
/* RIGHT */

.right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;

  min-width: 120px;
}

.remove {
  margin-right: 4px;
  padding: 4px;
}

/* MOBILE */

@media (max-width: 640px) {
  .favorite-card {
    padding: 12px;
  }

  .title {
    font-size: 14px;
  }

  .company {
    font-size: 12px;
  }
}
</style>
