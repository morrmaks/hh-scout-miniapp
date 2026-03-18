<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { computed } from 'vue';

import Button from '@/common/ui/Button.vue';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@/common/ui/Dropdown';
import { useFavoritesStore } from '@/modules/favorites';

import { useResumesStore } from '../store/resumes.store';

const resumes = useResumesStore();
const favorites = useFavoritesStore();

const selected = computed(() => resumes.items.find((r) => r.id === resumes.activeResumeId));

function select(id: number, close: () => void) {
  resumes.setActiveResume(id);
  favorites.invalidate();
  close();
}
</script>

<template>
  <Dropdown>
    <DropdownTrigger as-child>
      <Button variant="outline" class="trigger">
        <span v-if="selected">
          {{ selected.name }}
        </span>

        <span v-else class="placeholder"> Выберите резюме </span>

        <ChevronDown :size="14" />
      </Button>
    </DropdownTrigger>

    <DropdownContent>
      <div class="content">
        <template v-if="resumes.items.length">
          <DropdownItem v-for="r in resumes.items" :key="r.id" v-slot="{ close }" as-child>
            <Button
              variant="ghost"
              class="item"
              :active="r.id === resumes.activeResumeId"
              @click="select(r.id, close)"
            >
              {{ r.name }}
            </Button>
          </DropdownItem>
        </template>
      </div>
    </DropdownContent>
  </Dropdown>
</template>

<style scoped>
.trigger {
  display: flex;
  align-items: center;
  gap: 8px;
}

.placeholder {
  color: var(--text-muted);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 220px;
}

.item {
  width: 100%;
  justify-content: flex-start;
  border-radius: 8px;
}
</style>
