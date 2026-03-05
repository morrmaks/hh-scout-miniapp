<script setup lang="ts">
import { onMounted, watch } from 'vue';

import Spinner from '@/common/ui/Spinner.vue';
import { useJobsStore } from '@/modules/jobs/store/jobs.store';
import JobsPagination from '@/modules/jobs/ui/JobsPagination.vue';
import JobsSearch from '@/modules/jobs/ui/JobsSearch.vue';
import JobViewer from '@/modules/jobs/ui/JobViewer.vue';

const store = useJobsStore();

onMounted(() => {
  store.restore();

  if (store.query) {
    store.fetchJobs();
  }
});

watch(
  () => [store.page, store.index, store.query],
  () => {
    store.savePosition();
  }
);
</script>

<template>
  <div class="page">
    <JobsSearch @search="store.setQuery" />

    <!-- Первый запрос -->
    <div v-if="store.loading && !store.hasData" class="loader">
      <Spinner />
    </div>

    <!-- Контент -->
    <div v-else class="content" :class="{ disabled: store.loading && store.hasData }">
      <JobViewer
        :job="store.currentJob"
        :position="store.pagePosition"
        @next="store.nextJob"
        @prev="store.prevJob"
      />

      <JobsPagination :page="store.page" :pages="store.pages" @change="store.setPage" />
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

/* контейнер данных */
.content {
  display: flex;
  flex-direction: column;

  transition: opacity 0.2s ease;
}

/* disabled состояние */
.content.disabled {
  opacity: 0.45;
  pointer-events: none;
}

/* spinner */
.loader {
  display: flex;
  justify-content: center;
  margin-top: 80px;
}
</style>
