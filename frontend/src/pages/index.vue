<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import PaginationSkeleton from '@/common/ui/PaginationSkeleton.vue';
import { useAreasStore } from '@/modules/areas';
import { useJobsStore } from '@/modules/jobs/store/jobs.store';
import JobsFiltersDrawer from '@/modules/jobs/ui/JobsFiltersDrawer.vue';
import JobsFiltersToggle from '@/modules/jobs/ui/JobsFiltersToggle.vue';
import JobsPagination from '@/modules/jobs/ui/JobsPagination.vue';
import JobsSearch from '@/modules/jobs/ui/JobsSearch.vue';
import JobsSearchHistory from '@/modules/jobs/ui/JobsSearchHistory.vue';
import JobViewer from '@/modules/jobs/ui/JobViewer.vue';
import JobViewerSkeleton from '@/modules/jobs/ui/JobViewerSkeleton.vue';

const store = useJobsStore();
const areasStore = useAreasStore();

const filtersOpen = ref(false);

onMounted(() => {
  store.restore();
  areasStore.fetchAreas();
});

watch([() => store.page, () => store.index, () => store.query], () => store.savePosition());
</script>

<template>
  <div class="page">
    <JobsSearch />

    <JobsSearchHistory @select="store.setQuery" />

    <JobsFiltersToggle :open="filtersOpen" @toggle="filtersOpen = !filtersOpen" />

    <JobsFiltersDrawer v-model:open="filtersOpen" />

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
