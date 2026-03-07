<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import PaginationSkeleton from '@/common/ui/PaginationSkeleton.vue';
import { useAreasStore } from '@/modules/areas';
import {
  JobsFiltersDrawer,
  JobsFiltersToggle,
  JobsPagination,
  JobsSearch,
  JobsSearchHistory,
  JobViewer,
  JobViewerSkeleton,
  useJobsStore
} from '@/modules/jobs';

const store = useJobsStore();
const areasStore = useAreasStore();

const filtersOpen = ref(false);

const searchState = computed(() => {
  if (!store.query) return 'idle';
  if (store.loading && !store.initialized) return 'loading';
  if (store.found === 0) return 'empty';
  return 'results';
});

const foundText = computed(() => {
  if (!store.found) return '';
  return `Найдено ${store.found} вакансий`;
});

onMounted(() => {
  store.restore();
  areasStore.fetchAreas();
});
</script>

<template>
  <div class="page">
    <JobsSearch />

    <JobsSearchHistory @select="store.setQuery" />

    <JobsFiltersToggle :open="filtersOpen" @toggle="filtersOpen = !filtersOpen" />

    <JobsFiltersDrawer v-model:open="filtersOpen" />

    <div v-if="searchState === 'empty'" class="search-empty">Ничего не найдено</div>
    <div v-else-if="searchState === 'results'" class="search-found">
      {{ foundText }}
    </div>
    <div v-if="searchState === 'idle'" class="search-idle">Начните искать вакансии</div>

    <div v-if="store.loading && !store.initialized">
      <JobViewerSkeleton />
      <PaginationSkeleton />
    </div>

    <div v-else class="content" :class="{ disabled: store.loading && store.initialized }">
      <JobViewer
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
.page {
  max-width: 900px;
  margin: 0 auto;

  padding: 16px;

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
}

.content.disabled {
  opacity: 0.6;
  pointer-events: none;
}

/* mobile */

@media (max-width: 640px) {
  .page {
    padding: 12px;
    gap: 14px;
  }
}
</style>
