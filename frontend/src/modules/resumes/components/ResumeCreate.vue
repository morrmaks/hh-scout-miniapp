<script setup lang="ts">
import { PlusIcon } from 'lucide-vue-next';
import { ref } from 'vue';

import Button from '@/common/ui/Button.vue';
import Input from '@/common/ui/Input.vue';
import { useFavoritesStore } from '@/modules/favorites';
import { useResumesStore } from '@/modules/resumes';

defineProps<{
  autoFocus?: boolean;
}>();

const emit = defineEmits<{
  (e: 'created', id: number): void;
}>();

const resumes = useResumesStore();
const favorites = useFavoritesStore();

const name = ref('');
const loading = ref(false);

async function handleCreate() {
  const value = name.value.trim();
  if (!value || loading.value) return;

  loading.value = true;

  try {
    const resume = await resumes.createResume(value);
    favorites.invalidate();

    emit('created', resume.id);

    name.value = '';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="resume-create">
    <Input
      v-model="name"
      placeholder="Создайте резюме"
      :autofocus="autoFocus"
      class="input"
      @keydown.enter="handleCreate"
    />

    <Button class="create-button" variant="ghost" :disabled="loading" @click="handleCreate">
      <PlusIcon :size="16" />
      Создать
    </Button>
  </div>
</template>

<style scoped>
.resume-create {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
</style>
