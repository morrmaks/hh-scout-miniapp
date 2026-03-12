<script setup lang="ts">
import { reactive, watch } from 'vue';

import Button from '@/common/ui/Button.vue';
import FilterGroup from '@/common/ui/FilterGroup.vue';
import InputNumber from '@/common/ui/InputNumber.vue';
import Select from '@/common/ui/Select.vue';
import Separator from '@/common/ui/Separator.vue';
import { ToggleGroup, ToggleGroupCollapse, ToggleGroupItem } from '@/common/ui/ToggleGroup';

import type { FavoritesFilters } from '../../types/favorites.types';

import { StatusBadge, useStatusesStore } from '../../statuses';
import { useFavoritesStore } from '../../store/favorites.store';
import { sortOptions } from '../config/favoritesFilters.options';

interface Props {
  modelValue: FavoritesFilters;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  apply: [FavoritesFilters];
}>();

const store = useFavoritesStore();
const statuses = useStatusesStore();

const local = reactive<FavoritesFilters>({
  ...props.modelValue
});

watch(
  () => props.modelValue,
  (v) => {
    Object.assign(local, v);
  }
);

function apply() {
  emit('apply', { ...local });
}
</script>

<template>
  <div class="filters">
    <FilterGroup label="Сортировка">
      <Select v-model="local.sort" :options="sortOptions" />
    </FilterGroup>

    <Separator />

    <FilterGroup label="Зарплата от">
      <InputNumber v-model="local.salary_from" placeholder="100000" />
    </FilterGroup>

    <Separator />

    <FilterGroup label="Компания">
      <ToggleGroup v-model="local.company">
        <ToggleGroupCollapse :limit="5">
          <ToggleGroupItem v-for="company in store.companies" :key="company" :value="company">
            {{ company }}
          </ToggleGroupItem>
        </ToggleGroupCollapse>
      </ToggleGroup>
    </FilterGroup>

    <Separator />

    <FilterGroup label="Статус">
      <ToggleGroup v-model="local.status">
        <ToggleGroupItem
          v-for="s in statuses.statuses"
          :key="s.id"
          v-slot="{ active }"
          :value="s.id"
          as-child
        >
          <StatusBadge
            variant="filled"
            :name="s.name"
            :color="s.color"
            :style="{ opacity: active ? 1 : 0.45 }"
          />
        </ToggleGroupItem>
      </ToggleGroup>
    </FilterGroup>
  </div>

  <div class="footer">
    <Button class="applyButton" @click="apply"> Применить фильтры </Button>
  </div>
</template>

<style scoped>
.filters {
  display: grid;
  gap: 18px;
}

.footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .applyButton {
    width: 100%;
  }
}
</style>
