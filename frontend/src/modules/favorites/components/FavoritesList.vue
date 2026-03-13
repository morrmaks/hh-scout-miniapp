<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { onMounted, ref } from 'vue';

import { useFavoritesStore } from '../store/favorites.store';
import FavoriteListItem from './FavoritesListItem.vue';
import FavoritesListSkeleton from './FavoritesListSkeleton.vue';

const favorites = useFavoritesStore();

const sentinel = ref<HTMLElement | null>(null);

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
    <FavoriteListItem v-for="job in favorites.items" :key="job.jobId" :job="job" />

    <FavoritesListSkeleton v-if="favorites.loadingMore" :count="3" />

    <div ref="sentinel" class="sentinel" />

    <div v-if="!favorites.loading && favorites.items.length === 0" class="empty">
      Избранного нет
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
