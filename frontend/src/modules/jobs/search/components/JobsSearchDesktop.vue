<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { ref } from 'vue';

import { Dropdown, DropdownContent, DropdownTrigger } from '@/common/ui/Dropdown';
import Input from '@/common/ui/Input.vue';

import type { SearchController, SearchHistoryItem } from '../types/search.types';

import JobsSearchList from './JobsSearchList.vue';

const props = defineProps<SearchController>();

const open = ref(false);
const committedQuery = ref(props.query.value);
const isSelecting = ref(false);

function onFocus() {
  committedQuery.value = props.query.value;
  open.value = true;
}

function onBlur() {
  if (isSelecting.value) return;

  props.setQuery(committedQuery.value);
  open.value = false;
}

function onEnter() {
  committedQuery.value = props.query.value;
  props.submit();
  open.value = false;
}

function onListMousedown() {
  isSelecting.value = true;
}

function onListMouseup() {
  setTimeout(() => {
    isSelecting.value = false;
  }, 0);
}

function selectHistory(item: SearchHistoryItem) {
  isSelecting.value = false;
  committedQuery.value = item.query;
  props.applyHistory(item);
  open.value = false;
}

function select(v: string) {
  committedQuery.value = v;
  props.submit(v);
  open.value = false;
}
</script>

<template>
  <Dropdown v-model:open="open" class="dropdown-root">
    <DropdownTrigger as-child style="width: 100%; display: block">
      <div class="input-wrap">
        <Search class="input-icon" :size="15" />

        <Input
          :model-value="props.query.value"
          class="input"
          placeholder="Поиск вакансий..."
          @update:model-value="props.setQuery"
          @focus="onFocus"
          @blur="onBlur"
          @enter="onEnter"
        />
      </div>
    </DropdownTrigger>

    <DropdownContent fit="trigger">
      <div class="dropdown-inner" @mousedown.prevent="onListMousedown" @mouseup="onListMouseup">
        <JobsSearchList
          :query="props.query.value"
          :suggestions="props.suggestions.value"
          :history="props.history.value"
          :on-remove="props.removeHistory"
          :on-clear="props.clearHistory"
          :on-apply="selectHistory"
          @select="select"
        />
      </div>
    </DropdownContent>
  </Dropdown>
</template>

<style scoped>
.dropdown-root {
  width: 100%;
}

.input-wrap {
  position: relative;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

/* отступ слева под иконку */
.input {
  width: 100%;
  display: block;
  padding-left: 36px !important;
}

.dropdown-inner {
  max-height: 320px;
  overflow-y: auto;
}
</style>
