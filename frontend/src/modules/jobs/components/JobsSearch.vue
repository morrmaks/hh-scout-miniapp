<script setup lang="ts">
import { Bookmark, Search } from 'lucide-vue-next';
import { computed } from 'vue';

import Button from '@/common/ui/Button.vue';
import Input from '@/common/ui/Input.vue';

import { useSearchHistory } from '../composables/useSearchHistory';
import { useJobsStore } from '../store/jobs.store';

const store = useJobsStore();
const { add } = useSearchHistory();

const query = computed({
  get: () => store.query,
  set: (v: string) => (store.query = v)
});

function submit() {
  store.setQuery(query.value);
}

function saveQuery() {
  const q = query.value;
  if (!q) return;
  add(q);
}
</script>

<template>
  <div class="search">
    <Button variant="outline" size="sm" @click="saveQuery">
      <Bookmark :size="16" />
    </Button>

    <Input v-model="query" placeholder="Поиск вакансий..." @enter="submit" />

    <Button class="search-submit" @click="submit">
      <Search :size="16" />
      <span>Поиск</span>
    </Button>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  gap: 8px;
}

@media (max-width: 640px) {
  .search-submit :deep(span) {
    display: none;
  }

  .search :deep(svg) {
    width: 14px;
    height: 14px;
  }
}
</style>
