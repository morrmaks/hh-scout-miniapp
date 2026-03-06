<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import Spinner from '@/common/ui/Spinner.vue';
import { useJobsStore } from '@/modules/jobs/store/jobs.store';
import JobsFilters from '@/modules/jobs/ui/JobsFilters.vue';
import JobsFiltersToggle from '@/modules/jobs/ui/JobsFiltersToggle.vue';
import JobsPagination from '@/modules/jobs/ui/JobsPagination.vue';
import JobsSearch from '@/modules/jobs/ui/JobsSearch.vue';
import JobViewer from '@/modules/jobs/ui/JobViewer.vue';

const store = useJobsStore();

const filtersOpen = ref(false);

onMounted(() => {
  store.restore();

  if (store.query) store.fetchJobs();
});

watch(
  () => [store.page, store.index, store.query],
  () => store.savePosition()
);
</script>

<template>
  <div class="page">
    <JobsSearch @search="store.setQuery" />

    <JobsFiltersToggle :open="filtersOpen" @toggle="filtersOpen = !filtersOpen" />

    <transition name="filters">
      <JobsFilters v-if="filtersOpen" @change="store.setFilters" />
    </transition>

    <div v-if="store.loading && !store.hasData" class="loader">
      <Spinner />
    </div>

    <div v-else class="content" :class="{ disabled: store.loading && store.hasData }">
      <JobViewer
        :job="store.currentJob"
        :position="store.pagePosition"
        :disable-prev="store.index === 0"
        :disable-next="store.index === store.perPage - 1"
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
  max-width: 760px;
  margin: 0 auto;

  padding: 40px 20px;

  display: flex;
  flex-direction: column;
  gap: 28px;
}

.content {
  display: flex;
  flex-direction: column;

  transition: opacity 0.2s ease;
}

.content.updating {
  opacity: 0.45;
  pointer-events: none;
}

.content.disabled {
  opacity: 0.45;
  pointer-events: none;
}

.loader {
  display: flex;
  justify-content: center;
  margin-top: 80px;
}

.filters-enter-active,
.filters-leave-active {
  transition: all 0.18s ease;
}

.filters-enter-from,
.filters-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
