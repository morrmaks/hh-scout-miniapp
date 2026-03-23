<script setup lang="ts">
import { computed, onMounted } from 'vue';

import { useAreasStore } from '@/modules/areas';
import {
  JobsFiltersRow,
  JobsPagination,
  JobsPaginationSkeleton,
  JobsSearch,
  JobsSearchHistory,
  JobsViewer,
  JobsViewerSkeleton,
  useJobsStore
} from '@/modules/jobs';

const store = useJobsStore();
const areasStore = useAreasStore();

const searchState = computed(() => {
  if (!store.lastSearchQuery) return store.initialized ? 'idle' : 'initial';
  if (store.loading) return store.initialized ? 'refreshing' : 'loading';
  return store.found ? 'results' : 'empty';
});

const showSkeleton = computed(
  () =>
    searchState.value === 'loading' || (searchState.value === 'refreshing' && !store.items.length)
);

const foundText = computed(() => (store.found ? `Найдено ${store.found} вакансий` : ''));

onMounted(() => {
  if (!store.initialized) store.restore();
  if (!areasStore.initialized) areasStore.fetchAreas();
});
</script>

<template>
  <div class="main-page">
    <JobsSearch />

    <JobsSearchHistory @select="store.setQuery" />

    <JobsFiltersRow />

    <div v-if="searchState === 'initial'" class="search-idle">Начните искать вакансии</div>

    <div v-else-if="searchState === 'idle'" class="search-idle">Введите запрос, пожалуйста</div>

    <div v-else-if="searchState === 'empty'" class="search-empty">Ничего не найдено</div>

    <div v-else-if="searchState === 'results' || searchState === 'refreshing'" class="search-found">
      {{ foundText }}
    </div>

    <template v-if="showSkeleton">
      <JobsViewerSkeleton />
      <JobsPaginationSkeleton />
    </template>

    <div v-else class="content" :class="{ disabled: searchState === 'refreshing' }">
      <JobsViewer
        :job="store.currentJob"
        :position="store.pagePosition"
        :disable-prev="store.index === 0"
        :disable-next="store.index === store.pageItems - 1"
        @next="store.nextJob"
        @prev="store.prevJob"
      />

      <JobsPagination
        v-if="store.hasData"
        :page="store.page"
        :pages="store.pages"
        @change="store.setPage"
      />
    </div>
  </div>
</template>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;

  gap: 16px;
}

.search-idle {
  text-align: center;
  padding: 40px 0;

  font-size: 16px;
  color: var(--text-muted);
}

.search-empty {
  text-align: center;
  padding: 40px 0;

  font-size: 16px;
  color: var(--text-muted);
}

.search-found {
  font-size: 13px;
  color: var(--text-muted);
}
.content {
  display: flex;
  flex-direction: column;

  gap: 16px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.content.disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* mobile */

@media (max-width: 640px) {
  .main-page {
    gap: 14px;
  }
}
</style>
