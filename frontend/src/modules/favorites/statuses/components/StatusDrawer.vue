<script setup lang="ts">
import { PlusIcon, Trash2 } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

import type { StatusColor } from '@/common/api/generated';

import Button from '@/common/ui/Button.vue';
import { Drawer, DrawerContent, DrawerTrigger } from '@/common/ui/Drawer';
import Separator from '@/common/ui/Separator.vue';

import StatusBadge from './StatusBadge.vue';
import StatusCreateInline from './StatusCreateInline.vue';
import StatusEditInline from './StatusEditInline.vue';

interface StatusWithMeta {
  color: StatusColor;
  id: number;
  name: string;
  pending?: boolean;
  userId: number;
}

const props = defineProps<{
  statuses: StatusWithMeta[];
  modelValue?: number | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', id: number | null): void;
  (e: 'create', name: string, color: StatusColor): void;
  (e: 'update', id: number, payload: { name?: string; color?: StatusColor }): void;
  (e: 'delete', id: number): void;
}>();

const open = ref(false);

const editing = ref<number | null>(null);
const creating = ref(false);
const manage = ref(false);

const current = computed(() => props.statuses.find((s) => s.id === props.modelValue));

function reset() {
  editing.value = null;
  creating.value = false;
  manage.value = false;
}

watch(open, (v) => {
  if (!v) reset();
});

function select(id: number | null) {
  emit('update:modelValue', id);
  open.value = false;
}

function startCreate() {
  creating.value = true;
  editing.value = null;
  manage.value = false;
}

function startEdit(id: number) {
  const status = props.statuses.find((s) => s.id === id);
  if (status?.pending) return;

  editing.value = id;
  creating.value = false;
}

function toggleManage() {
  manage.value = !manage.value;
  editing.value = null;
  creating.value = false;
}

function createStatus(name: string, color: StatusColor) {
  emit('create', name, color);
  creating.value = false;
}

function updateStatus(id: number, name: string, color: StatusColor) {
  emit('update', id, { name, color });
  editing.value = null;
}
</script>

<template>
  <Drawer v-model:open="open">
    <DrawerTrigger>
      <button class="trigger">
        <StatusBadge v-if="current" :name="current.name" :color="current.color" variant="filled" />

        <span v-else class="placeholder">
          <PlusIcon :size="14" />
        </span>
      </button>
    </DrawerTrigger>

    <DrawerContent>
      <div class="list">
        <div v-if="modelValue !== null" class="reset-badge" @click="select(null)">Без статуса</div>

        <template v-for="s in statuses" :key="s.id">
          <StatusEditInline
            v-if="editing === s.id"
            :name="s.name"
            :color="s.color"
            @save="(name, color) => updateStatus(s.id, name, color)"
          />

          <div v-else class="row" :class="{ manage, pending: s.pending }">
            <StatusBadge
              class="status"
              :name="s.pending ? 'Создание...' : s.name"
              :color="s.color"
              variant="filled"
              @click="!s.pending && (manage ? startEdit(s.id) : select(s.id))"
            />

            <Button
              v-if="manage && !s.pending"
              size="xs"
              variant="ghost"
              class="delete"
              @click.stop="emit('delete', s.id)"
            >
              <Trash2 :size="14" />
            </Button>
          </div>
        </template>
      </div>

      <StatusCreateInline v-if="creating" @create="createStatus" />

      <Separator class="separator" />

      <div class="footer">
        <Button size="lg" variant="ghost" @click="startCreate"> Создать </Button>

        <Button size="lg" variant="ghost" @click="toggleManage">
          {{ manage ? 'Готово' : 'Редактировать' }}
        </Button>
      </div>
    </DrawerContent>
  </Drawer>
</template>

<style scoped>
.trigger {
  border: none;
  background: none;
  cursor: pointer;
}

.list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reset-badge {
  width: 100%;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  border: 2px solid var(--border);
}

.row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.row.pending {
  opacity: 0.5;
  pointer-events: none;
}

.row.manage .status {
  animation: pulse 0.6s ease-in-out infinite alternate;
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.96);
  }
}

.delete {
  padding: 2px;
}

.placeholder {
  color: var(--text-muted);
}

.separator {
  margin: 16px 0;
}

.footer {
  display: flex;
  justify-content: space-between;
}

.footer > .btn {
  width: 100%;
}
</style>
