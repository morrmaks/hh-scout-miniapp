<script setup lang="ts">
import { Search, X } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import Button from '@/common/ui/Button.vue';
import { useAreasStore } from '@/modules/areas';

import type { SearchHistoryItem } from '../types/search.types';

import { formatHistoryFilters } from '../lib/formatHistoryFilters';

const props = defineProps<{
  query: string;
  suggestions: string[];
  history: SearchHistoryItem[];
  onRemove?: (item: SearchHistoryItem) => void;
  onClear?: () => void;
  onApply?: (item: SearchHistoryItem) => void;
}>();

const emit = defineEmits<{
  select: [string];
}>();

const areasStore = useAreasStore();

const areaMap = computed(() => new Map(areasStore.items.map((a) => [a.id, a.name])));

const formattedHistory = computed(() =>
  props.history.map((item) => ({
    ...item,
    meta: formatHistoryFilters(item, areaMap.value)
  }))
);

const HISTORY_PREVIEW = 3;

const showAllHistory = ref(false);

const isQueryEmpty = computed(() => !props.query.trim());

const showClearAll = computed(
  () => isQueryEmpty.value && showAllHistory.value && props.history.length > HISTORY_PREVIEW
);

const visibleHistory = computed(() => {
  if (!isQueryEmpty.value) return [];

  const list = showAllHistory.value
    ? formattedHistory.value
    : formattedHistory.value.slice(0, HISTORY_PREVIEW);

  return list;
});

const hasMoreHistory = computed(
  () => isQueryEmpty.value && !showAllHistory.value && props.history.length > HISTORY_PREVIEW
);
</script>

<template>
  <div class="list">
    <template v-if="isQueryEmpty">
      <template v-if="history.length">
        <div class="section-label">
          История поиска
        </div>

        <TransitionGroup name="fade" tag="div" class="items">
          <Button
            v-for="item in visibleHistory"
            :key="item.timestamp"
            variant="ghost"
            class="item"
            @click="props.onApply?.(item)"
          >
            <div class="item-left">
              <span class="item-text">{{ item.query }}</span>

              <div class="item-meta">
                <span v-for="(p, i) in item.meta" :key="i" class="meta-part">
                  {{ p }}
                </span>
              </div>
            </div>

            <X class="item-remove" :size="14" @click.stop="props.onRemove?.(item)" />
          </Button>
        </TransitionGroup>

        <Button v-if="showClearAll" variant="link" class="clear-all" @click="props.onClear?.()">
          Очистить историю
        </Button>

        <Button
          v-if="hasMoreHistory"
          variant="link"
          class="show-all"
          @click="showAllHistory = true"
        >
          Смотреть всю ({{ history.length }})
        </Button>
      </template>

      <div v-else class="empty">
        <Search :size="16" />
        <span>Введите запрос</span>
      </div>
    </template>

    <template v-else>
      <Transition name="fade">
        <div v-if="suggestions.length" class="items">
          <Button
            v-for="(item, i) in suggestions"
            :key="`s-${item}`"
            variant="ghost"
            class="item"
            :class="{ 'item-exact': i === 0 }"
            @click="emit('select', item)"
          >
            <Search v-if="i === 0" :size="14" class="item-icon" />
            {{ item }}
          </Button>
        </div>

        <div v-else class="empty">
          <Search :size="16" />
          <span>Ничего не найдено</span>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.section-label {
  padding: 8px 12px 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
}

.items {
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: start;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: start;
  width: 100%;
  gap: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 400;
  border-radius: 6px;
}

.item-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.item-meta {
  font-size: 12px;
  color: var(--text-muted);
  display: inline-flex;
  flex-wrap: wrap;
}

.meta-part {
  display: inline-flex;
  align-items: center;
}

.meta-part:not(:last-child)::after {
  content: '•';
  margin: 0 6px;
  color: var(--text-muted);
}

.item-text {
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-remove {
  opacity: 0;
  flex-shrink: 0;
  color: var(--text-muted);
}

.item:hover .item-remove {
  opacity: 1;
}

.item-exact {
  justify-content: start;
  font-weight: 500;
}

.item-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.clear-all {
  justify-content: start;
  color: var(--destructive-text);
  margin-top: 8px;
  width: max-content;
}

.clear-all:hover:not(:disabled) {
  color: var(--text);
}

.show-all {
  padding: 0;
  margin: 0;
  justify-content: start;
  color: var(--primary);
  height: auto;
  min-height: unset;
  padding-left: 12px;
  padding-top: 6px;
  padding-bottom: 6px;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 16px;
  color: var(--text-muted);
  font-size: 14px;
}

.fade-enter-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.fade-leave-to {
  opacity: 0;
}
.fade-move {
  transition: transform 0.15s ease;
}

@media (hover: none) and (pointer: coarse) {
  .item-remove {
    opacity: 1;
  }
}
</style>
