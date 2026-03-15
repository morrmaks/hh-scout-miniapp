<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { onMounted, ref } from 'vue';

import { useFavoritesStore } from '../store/favorites.store';
import FavoriteListItem from './FavoritesListItem.vue';
import FavoritesListSkeleton from './FavoritesListSkeleton.vue';

const favorites = useFavoritesStore();

const sentinel = ref<HTMLElement | null>(null);
const expanded = ref(false);

function toggle() {
  expanded.value = !expanded.value;
}

useIntersectionObserver(
  sentinel,
  ([entry]) => {
    if (!entry?.isIntersecting) return;

    if (favorites.loading || favorites.loadingMore || !favorites.hasMore) return;

    favorites.loadMore();
  },
  {
    rootMargin: '200px'
  }
);

onMounted(() => {
  favorites.fetchFavorites();
});
</script>

<template>
  <FavoritesListSkeleton v-if="favorites.showSkeleton" :count="5" />

  <div v-else class="content" :class="{ disabled: favorites.contentDisabled }">
    <p class="results" :class="{ expanded }" @click="toggle">
      {{ favorites.resultsMessage }}
    </p>

    <FavoriteListItem v-for="job in favorites.items" :key="job.jobId" :job="job" />

    <FavoritesListSkeleton v-if="favorites.loadingMore" :count="3" />

    <div ref="sentinel" class="sentinel" />

    <div v-if="favorites.isEmpty && !favorites.loading" class="empty">
      {{ favorites.emptyMessage }}
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;

  height: 100%;
  overflow-y: auto;

  padding-bottom: 20px;
}

.results {
  font-size: 13px;
  color: var(--text-muted);

  cursor: pointer;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.results.expanded {
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}

.content.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.sentinel {
  height: 1px;
}

.empty {
  text-align: center;
  padding: 48px 16px;

  font-size: 14px;
  opacity: 0.7;
}

@media (max-width: 640px) {
  .favorites-list {
    gap: 8px;
  }
}
</style>
