<script setup lang="ts">
import Drawer from '@/common/ui/Drawer.vue';

import type { JobFilters } from '../types/jobsFilters';

import { useJobsStore } from '../store/jobs.store';
import JobsFilters from './JobsFilters.vue';

defineProps<Props>();

const emit = defineEmits<{
  'update:open': [boolean];
}>();

const store = useJobsStore();

interface Props {
  open: boolean;
}

function apply(filters: JobFilters) {
  store.setFilters(filters);
  emit('update:open', false);
}
</script>

<template>
  <Drawer :open="open" @update:open="emit('update:open', $event)">
    <JobsFilters :model-value="store.filters" @apply="apply" />
  </Drawer>
</template>
