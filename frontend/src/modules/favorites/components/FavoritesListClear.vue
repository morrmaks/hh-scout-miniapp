<script setup lang="ts">
import { computed, ref } from 'vue';

import Button from '@/common/ui/Button.vue';
import Checkbox from '@/common/ui/Checkbox.vue';
import { Dialog, DialogContent, DialogTrigger } from '@/common/ui/Dialog';
// import { useFavoritesStore } from '../store/favorites.store'
import { useResumesStore } from '@/modules/resumes';

// const favorites = useFavoritesStore()
const resumes = useResumesStore();

const deleteAll = ref(false);

/* ---------------- computed ---------------- */

const resumeIds = computed(() => {
  if (deleteAll.value) return resumes.items.map((r) => r.id);

  if (resumes.activeResumeId) return [resumes.activeResumeId];

  return [];
});

/* ---------------- actions ---------------- */

function handleDelete(close: () => void) {
  if (!resumeIds.value.length) return;

  // favorites.items.forEach(item => {
  //   favorites.deleteFavorite(item.jobId, resumeIds.value)
  // })

  close();
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="ghost" class="clear-button"> Очистить избранное </Button>
    </DialogTrigger>

    <DialogContent v-slot="{ close }">
      <div class="dialog">
        <div class="title">Очистить избранное?</div>

        <Checkbox v-model="deleteAll" label="Очистить все резюме" />

        <div class="actions">
          <Button variant="ghost" @click="close"> Отмена </Button>

          <Button variant="destructive" @click="handleDelete(close)"> Очистить </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  font-weight: 500;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.clear-button {
  padding: 8px 10px;
}
</style>
