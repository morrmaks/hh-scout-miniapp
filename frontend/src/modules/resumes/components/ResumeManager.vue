<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import { ref } from 'vue';

import Button from '@/common/ui/Button.vue';
import Card from '@/common/ui/Card.vue';
import Input from '@/common/ui/Input.vue';

import { useResumesStore } from '../store/resumes.store';
import ResumeCreate from './ResumeCreate.vue';
import ResumeDelete from './ResumeDelete.vue';

const resumes = useResumesStore();

const drafts = ref<Record<number, string>>({});
const isActionClick = ref(false);

const getValue = (id: number, initial: string) => drafts.value[id] ?? initial;

const setValue = (id: number, value: string) => (drafts.value[id] = value);

const reset = (id: number) => delete drafts.value[id];

const isChanged = (id: number, initial: string) => {
  const value = drafts.value[id]?.trim();
  return value !== undefined && value !== initial;
};

function save(id: number, initial: string) {
  const value = drafts.value[id]?.trim();
  if (!value || value === initial) return;

  resumes.updateResume(id, value);
  reset(id);
}

function onActionPointerDown() {
  isActionClick.value = true;
}

function handleBlur(id: number, initial: string) {
  if (isActionClick.value) {
    isActionClick.value = false;
    return;
  }

  if (!isChanged(id, initial)) return;

  reset(id);
}
</script>

<template>
  <div class="resumes-manager">
    <Card class="list">
      <ResumeCreate />

      <div v-for="r in resumes.items" :key="r.id" class="item">
        <Input
          :model-value="getValue(r.id, r.name)"
          class="input"
          @update:model-value="setValue(r.id, $event)"
          @blur="handleBlur(r.id, r.name)"
          @keydown.enter="save(r.id, r.name)"
        />

        <div class="actions">
          <Button
            v-if="isChanged(r.id, r.name)"
            size="xs"
            variant="ghost"
            @pointerdown="onActionPointerDown"
            @click="save(r.id, r.name)"
          >
            <Check :size="14" />
          </Button>

          <ResumeDelete :resume-id="r.id" />
        </div>
      </div>

      <div v-if="!resumes.items.length" class="empty">Нет резюме</div>
    </Card>
  </div>
</template>

<style scoped>
.resumes-manager {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

/* list */

.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  --card-padding: 8px;
}

/* item */

.item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* input */

.input {
  flex: 1;
  min-width: 0;
}

/* actions */

.actions {
  display: flex;
  gap: 6px;
}

/* empty */

.empty {
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
  padding: 16px 0;
}

.delete-button:hover:not(:disabled) {
  color: var(--destructive-text);
}
</style>
