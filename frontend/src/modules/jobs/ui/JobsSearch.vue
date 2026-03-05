<script setup lang="ts">
import { ref } from 'vue';

import Button from '@/common/ui/Button.vue';

const emit = defineEmits<{
  search: [string];
}>();

const query = ref('');

function submit() {
  if (!query.value.trim()) return;
  emit('search', query.value);
}
</script>

<template>
  <div class="search">
    <input v-model="query" placeholder="Search jobs..." @keyup.enter="submit" />

    <Button @click="submit"> Search </Button>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;

  background: #020617;
  border: 1px solid #1e293b;

  border-radius: 10px;

  padding: 10px 14px;

  color: var(--text);

  transition: all 0.15s ease;
}

input::placeholder {
  color: #64748b;
}

input:focus {
  outline: none;

  border-color: var(--primary);

  box-shadow:
    0 0 0 1px var(--primary),
    0 0 14px rgba(59, 130, 246, 0.25);
}
</style>
