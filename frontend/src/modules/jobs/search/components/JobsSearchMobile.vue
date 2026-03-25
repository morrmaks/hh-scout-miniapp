<script setup lang="ts">
import { useScroll } from '@vueuse/core';
import { Search } from 'lucide-vue-next';
import { computed, nextTick, ref, watch } from 'vue';

import Button from '@/common/ui/Button.vue';
import { Drawer, DrawerContent, DrawerTrigger } from '@/common/ui/Drawer';
import Input from '@/common/ui/Input.vue';
import ScrollFade from '@/common/ui/ScrollFade.vue';
import Separator from '@/common/ui/Separator.vue';

import type { SearchController, SearchHistoryItem } from '../types/search.types';

import JobsSearchList from './JobsSearchList.vue';

// ✅ получаем controller через props
const props = defineProps<SearchController>();

const open = ref(false);
const inputRef = ref();

// ✅ строка, не ref
const committedQuery = ref(props.query.value);

/* ---------------- sync ---------------- */

watch(
  () => props.query.value,
  (v) => {
    if (!open.value) committedQuery.value = v;
  }
);

/* ---------------- scroll ---------------- */

const listRef = ref<HTMLElement | null>(null);
const { y: listY } = useScroll(listRef);
const isScrolled = computed(() => listY.value > 4);

/* ---------------- drawer ---------------- */

watch(open, async (v) => {
  if (v) {
    committedQuery.value = props.query.value;

    await nextTick();
    inputRef.value?.focus();
  } else {
    props.setQuery(committedQuery.value); // ✅ фикс
  }
});

/* ---------------- actions ---------------- */

function onEnter() {
  committedQuery.value = props.query.value;
  props.submit();
  open.value = false;
}

function selectHistory(item: SearchHistoryItem) {
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
  <Drawer v-model:open="open">
    <DrawerTrigger style="width: 100%; display: block">
      <Button variant="outline" class="search-btn">
        <Search :size="16" class="search-icon" />

        <ScrollFade class="text-fade-wrap">
          <span class="text-inner" :class="{ placeholder: !committedQuery }">
            {{ committedQuery || 'Поиск вакансий...' }}
          </span>
        </ScrollFade>
      </Button>
    </DrawerTrigger>

    <DrawerContent fullscreen>
      <div class="search-header">
        <Input
          ref="inputRef"
          :model-value="props.query.value"
          class="search-input"
          placeholder="Поиск вакансий..."
          @update:model-value="props.setQuery"
          @enter="onEnter"
        />
      </div>

      <Separator class="top-border" :class="{ visible: isScrolled }" />

      <div ref="listRef" class="suggestions">
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
    </DrawerContent>
  </Drawer>
</template>

<style scoped>
.search-btn {
  width: 100%;
  justify-content: start;
  gap: 8px;
  overflow: hidden;
}

.search-icon {
  flex-shrink: 0;
  color: var(--text-muted);
}

/* ScrollFade занимает всё оставшееся место */
.text-fade-wrap {
  flex: 1;
  min-width: 0;
}

.text-inner {
  white-space: nowrap;
  font-size: inherit;
  color: var(--text);
}

.text-inner.placeholder {
  color: var(--text-muted);
}

/* ===== drawer ===== */

.search-header {
  display: flex;
  gap: 8px;
  padding: 12px 0;
}

.search-input {
  flex: 1;
  min-width: 0;
}

.top-border {
  opacity: 0;
  transform: scaleX(0.98);
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.top-border.visible {
  opacity: 1;
  transform: scaleX(1);
}

.suggestions {
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}
</style>
