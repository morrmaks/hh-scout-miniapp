<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import type { StatusColor } from '@/common/api/generated';

import Button from '@/common/ui/Button.vue';

import { STATUS_COLOR_MAP } from '../constants/statusColors';
import StatusColorPicker from './StatusColorPicker.vue';

const props = defineProps<{
  name: string;
  color: StatusColor;
}>();

const emit = defineEmits<{
  (e: 'save', name: string, color: StatusColor): void;
}>();

const name = ref(props.name);
const color = ref(props.color);

const style = computed(() => {
  const c = STATUS_COLOR_MAP[color.value];

  return {
    background: c,
    color: '#fff'
  };
});

function save() {
  emit('save', name.value, color.value);
}

const showPanel = ref(false);

onMounted(async () => {
  await nextTick();
  showPanel.value = true;
});
</script>

<template>
  <div class="editor">
    <input v-model="name" class="input" :style="style" @keydown.enter.prevent="save" />

    <Transition name="panel">
      <div v-if="showPanel" class="panel">
        <StatusColorPicker v-model="color" />

        <Button size="sm" variant="ghost" class="save-button" @click="save"> Сохранить </Button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input {
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  width: 100%;
  box-sizing: border-box;
}

.save-button {
  font-size: 14px;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px;
  overflow: hidden;
}

.panel-enter-active,
.panel-leave-active {
  transition: all 0.5s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  max-height: 0;
}

.panel-enter-to,
.panel-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 200px;
}

@media (hover: none) and (pointer: coarse) {
  .input {
    font-size: 16px;
  }
}
</style>
