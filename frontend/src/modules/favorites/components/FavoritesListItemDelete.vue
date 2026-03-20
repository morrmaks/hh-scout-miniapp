<script setup lang="ts">
import { Trash2Icon } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import Button from '@/common/ui/Button.vue';
import Checkbox from '@/common/ui/Checkbox.vue';
import { Dialog, DialogContent, DialogTrigger } from '@/common/ui/Dialog';
import { useResumesStore } from '@/modules/resumes';

import { useFavoritesStore } from '../store/favorites.store';

const props = defineProps<{
  jobId: string | undefined;
}>();

const favorites = useFavoritesStore();
const resumes = useResumesStore();

const deleteAll = ref(false);

const resumeIds = computed(() => {
  if (deleteAll.value) return resumes.items.map((r) => r.id);

  if (resumes.activeResumeId) return [resumes.activeResumeId];

  return [];
});

function handleDelete(close: () => void) {
  if (!props.jobId) return;
  if (!resumeIds.value.length) return;

  favorites.deleteFavorite(props.jobId, resumeIds.value);

  close();
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button size="xs" variant="link" class="delete-button">
        <Trash2Icon :size="12" />
      </Button>
    </DialogTrigger>

    <DialogContent v-slot="{ close }">
      <div class="dialog">
        <div class="title">
          Удалить вакансию?
        </div>

        <Checkbox v-model="deleteAll" label="Удалить из всех резюме" />

        <div class="actions">
          <Button variant="ghost" @click="close">
            Отмена
          </Button>

          <Button variant="destructive" @click="handleDelete(close)">
            Удалить
          </Button>
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
</style>
