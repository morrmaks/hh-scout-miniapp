<script setup lang="ts">
import { Bookmark, Search } from 'lucide-vue-next';
import { computed } from 'vue';

import Button from '@/common/ui/Button.vue';

import { useSearchHistory } from '../composables/useSearchHistory';
import { useJobsStore } from '../store/jobs.store';

const store = useJobsStore();
const { add } = useSearchHistory();

const query = computed({
  get: () => store.query,
  set: (v: string) => (store.query = v)
});

function submit() {
  const q = query.value.trim();
  if (!q) return;

  store.setQuery(q);
}

function saveQuery() {
  const q = query.value.trim();
  if (!q) return;

  add(q);
}
</script>

<template>
  <div class="search">
    <input v-model="query" placeholder="Search jobs..." @keyup.enter="submit" />

    <Button @click="submit">
      <Search :size="16" />
      Поиск
    </Button>

    <Button variant="ghost" @click="saveQuery">
      <Bookmark :size="16" />
    </Button>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  background: var(--card);
  border: 0px solid var(--border);
  border-radius: 10px;
  padding: 10px 14px;
  color: var(--text);
  transition: all 0.15s ease;
}

input::placeholder {
  color: var(--text-muted);
}

input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow:
    0 0 0 1px var(--primary),
    0 0 14px var(--primary-hover);
}

@media (max-width: 640px) {
  .search {
    gap: 6px;
  }

  input {
    padding: 8px 10px;
    font-size: 14px;
  }

  .search :deep(.btn) {
    padding: 6px 10px;
    font-size: 13px;
  }

  .search :deep(svg) {
    width: 14px;
    height: 14px;
  }

  .search :deep(.btn span) {
    display: none;
  }

  .search :deep(.btn) {
    padding: 8px;
  }
}
</style>
