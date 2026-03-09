<script setup lang="ts">
import Drawer from '@/common/ui/Drawer.vue';

import type { JobsFiltersType } from '../types/types';

import { useJobsStore } from '../store/jobs.store';
import JobsFilters from './JobsFilters.vue';

interface Props {
  open: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:open': [boolean];
}>();

const store = useJobsStore();

function apply(filters: JobsFiltersType) {
  store.setFilters(filters);
  emit('update:open', false);
}
</script>

<template>
  <Drawer :open="open" @update:open="emit('update:open', $event)">
    <JobsFilters :model-value="store.filters" @apply="apply" />
  </Drawer>
</template>
