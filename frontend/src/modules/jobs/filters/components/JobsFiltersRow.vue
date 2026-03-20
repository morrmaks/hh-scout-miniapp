<script setup lang="ts">
import { storeToRefs } from 'pinia';

import Select from '@/common/ui/Select.vue';

import { useJobsStore } from '../../store/jobs.store';
import { orderByOptions, perPageOptions } from '../config/jobsFilters.options';
import JobsFiltersDrawer from './JobsFiltersDrawer.vue';

const store = useJobsStore();

const { orderBy, perPage } = storeToRefs(store);
</script>

<template>
  <div class="toolbar">
    <JobsFiltersDrawer />

    <Select
      class="select"
      :model-value="perPage"
      :options="perPageOptions"
      @update:model-value="store.setPerPage"
    />

    <Select
      class="select"
      :model-value="orderBy"
      :options="orderByOptions"
      @update:model-value="store.setSort"
    />
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.select {
  flex-shrink: 0;
}
</style>
