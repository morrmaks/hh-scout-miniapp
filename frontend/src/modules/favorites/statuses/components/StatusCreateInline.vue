<script setup lang="ts">
import { computed, ref } from 'vue';

import type { StatusColor } from '@/common/api/generated';

import Button from '@/common/ui/Button.vue';

import { STATUS_COLOR_MAP } from '../constants/statusColors';
import StatusColorPicker from './StatusColorPicker.vue';

const emit = defineEmits<{
  (e: 'create', name: string, color: StatusColor): void;
}>();

const name = ref('');
const color = ref<StatusColor>('blue');

const style = computed(() => ({
  background: STATUS_COLOR_MAP[color.value],
  color: '#fff'
}));

function create() {
  if (!name.value.trim()) return;
  emit('create', name.value.slice(0, 30), color.value);
  name.value = '';
}
</script>

<template>
  <div class="creator">
    <input
      v-model="name"
      maxlength="30"
      class="input"
      :style="style"
      @keydown.enter.prevent="create"
    />

    <StatusColorPicker v-model="color" />

    <Button size="sm" variant="ghost" class="save-button" @click="create"> Сохранить </Button>
  </div>
</template>

<style scoped>
.creator {
  display: flex;
  flex-direction: column;
  margin-top: 2px;
  gap: 12px;
}

.input {
  color: var(--text);
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
}

.save-button {
  font-size: 14px;
}
</style>
