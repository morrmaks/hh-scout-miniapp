<script setup lang="ts">
import { EllipsisVerticalIcon, Trash2Icon } from 'lucide-vue-next';
import { ref } from 'vue';

import Button from '@/common/ui/Button.vue';
import Checkbox from '@/common/ui/Checkbox.vue';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@/common/ui/Dropdown';
import { ToggleGroup, ToggleGroupItem } from '@/common/ui/ToggleGroup';
import { ResumeCreateLink, useResumesStore } from '@/modules/resumes';

import { useFavoritesStore } from '../store/favorites.store';

const props = defineProps<{
  jobId: string;
  disabled?: boolean;
}>();

const resumes = useResumesStore();
const favorites = useFavoritesStore();

/* ---------------- state ---------------- */

const open = ref(false);

const draftSelected = ref<number[]>([]);
const draftSaveAsDefault = ref(false);

/* ---------------- init ---------------- */

function initDraft() {
  draftSelected.value = [...resumes.defaultSaveResumeIds];
  draftSaveAsDefault.value = false;
}

function handleOpenChange(v: boolean) {
  open.value = v;
  if (v) initDraft();
}

/* ---------------- actions ---------------- */

function handleSave(close: () => void) {
  if (!draftSelected.value.length) return;

  if (draftSaveAsDefault.value) resumes.setDefaultSaveResumes(draftSelected.value);

  favorites.saveFavorite(props.jobId, draftSelected.value);

  close();
}

function handleDelete(close: () => void) {
  if (!draftSelected.value.length) return;

  favorites.deleteFavorite(props.jobId, draftSelected.value);

  close();
}
</script>

<template>
  <Dropdown v-model:open="open" @update:open="handleOpenChange">
    <DropdownTrigger as-child>
      <Button class="trigger" variant="link" :disabled="props.disabled">
        <EllipsisVerticalIcon :size="14" />
      </Button>
    </DropdownTrigger>

    <DropdownContent>
      <div class="resume-save">
        <template v-if="!resumes.items.length">
          <ResumeCreateLink class="create-link" />
        </template>

        <template v-else>
          <ToggleGroup v-model="draftSelected" mode="multiple" class="list">
            <ToggleGroupItem v-for="r in resumes.items" :key="r.id" :value="r.id" class="item">
              {{ r.name }}
            </ToggleGroupItem>
          </ToggleGroup>

          <div class="save-choise">
            <Checkbox v-model="draftSaveAsDefault" label="Запомнить выбор" />
          </div>

          <!-- actions -->
          <div class="actions">
            <DropdownItem v-slot="{ close }" as-child>
              <Button class="save" :disabled="!draftSelected.length" @click="handleSave(close)">
                Сохранить вакансию
              </Button>
            </DropdownItem>

            <DropdownItem v-slot="{ close }" as-child>
              <Button
                class="delete"
                variant="destructive"
                :disabled="!draftSelected.length"
                @click="handleDelete(close)"
              >
                <Trash2Icon :size="14" />
              </Button>
            </DropdownItem>
          </div>
        </template>
      </div>
    </DropdownContent>
  </Dropdown>
</template>

<style scoped>
.trigger {
  all: unset;
  cursor: pointer;
  padding: 4px 8px 0;
}

.resume-save {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.create-link {
  margin: 4px 0;
  align-self: center;
  width: max-content;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item {
  display: flex;
  justify-content: start;
  width: 100%;
  padding: 8px 12px;
}

.save-choise {
  margin-top: 8px;
  padding: 0 4px;
}

/* 🔥 важный момент */
.actions {
  display: flex;
  gap: 8px;
}

.save {
  flex: 1;
  border-radius: 8px;
}

.delete {
  width: 36px;
  padding: 0;
}
</style>
