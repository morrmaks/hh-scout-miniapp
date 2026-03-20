<script setup lang="ts">
import { Trash2Icon } from 'lucide-vue-next';

import Button from '@/common/ui/Button.vue';
import { Dialog, DialogContent, DialogTrigger } from '@/common/ui/Dialog';
import { useFavoritesStore } from '@/modules/favorites';
import { useResumesStore } from '@/modules/resumes';

const props = defineProps<{
  resumeId: number;
}>();

const favorites = useFavoritesStore();
const resumes = useResumesStore();

async function remove() {
  const data = await resumes.removeResume(props.resumeId);
  if (data?.wasActive) favorites.invalidate();

  close();
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button size="xs" variant="link" class="delete-button">
        <Trash2Icon :size="14" />
      </Button>
    </DialogTrigger>

    <DialogContent v-slot="{ close }">
      <div class="dialog">
        <div class="title">
          Удалить вакансию?
        </div>

        <div class="actions">
          <Button variant="ghost" @click="close">
            Отмена
          </Button>

          <Button variant="destructive" @click="remove">
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
