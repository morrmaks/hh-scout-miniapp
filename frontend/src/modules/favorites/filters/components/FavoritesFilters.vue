<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { computed, reactive, watch } from 'vue';

import Button from '@/common/ui/Button.vue';
import Checkbox from '@/common/ui/Checkbox.vue';
import FilterGroup from '@/common/ui/FilterGroup.vue';
import InputNumber from '@/common/ui/InputNumber.vue';
import Select from '@/common/ui/Select.vue';
import Separator from '@/common/ui/Separator.vue';
import { ToggleGroup, ToggleGroupCollapse, ToggleGroupItem } from '@/common/ui/ToggleGroup';
import { equalObjects } from '@/common/utils/object';

import type { FavoritesFiltersType } from '../../types/favorites.types';

import { StatusBadge, useStatusesStore } from '../../statuses';
import { useFavoritesStore } from '../../store/favorites.store';
import { DEFAULT_FILTERS } from '../config/favoritesFilters.default';
import { currencyOptions } from '../config/favoritesFilters.options';

const emit = defineEmits<{
  apply: [FavoritesFiltersType];
  reset: [];
}>();

const favorites = useFavoritesStore();
const statuses = useStatusesStore();

const local = reactive<FavoritesFiltersType>({
  ...favorites.filters,
  company: favorites.filters.company ?? [],
  status: favorites.filters.status ?? [],
  label: favorites.filters.label ?? []
});

const hasLocalFilters = computed(() => !equalObjects(local, DEFAULT_FILTERS));

watch(
  () => favorites.filters,
  (v) => Object.assign(local, v)
);

function toggleSalaryLabel(enabled: boolean) {
  const labels = new Set(local.label ?? []);

  if (enabled) labels.add('with_salary');
  else labels.delete('with_salary');

  local.label = [...labels];
}

function toggleCurrencyLabel(enabled: boolean) {
  const labels = new Set(local.label ?? []);

  if (enabled) labels.add('same_currency');
  else labels.delete('same_currency');

  local.label = [...labels];
}

function reset() {
  Object.assign(local, DEFAULT_FILTERS);
  favorites.resetFilters();
  emit('reset');
}

function apply() {
  emit('apply', { ...local });
}
</script>

<template>
  <div class="filters">
    <FilterGroup label="Зарплата от">
      <div class="salary">
        <div class="salaryRow">
          <InputNumber v-model="local.salary_from" placeholder="100000" />

          <Select v-model="local.currency" :options="currencyOptions" />
        </div>

        <Checkbox
          :model-value="local.label?.includes('with_salary')"
          label="Только с зарплатой"
          @update:model-value="toggleSalaryLabel"
        />
        <Checkbox
          :model-value="local.label?.includes('same_currency')"
          label="Только с выбранной валютой"
          @update:model-value="toggleCurrencyLabel"
        />
      </div>
    </FilterGroup>

    <Separator />

    <FilterGroup label="Компания">
      <ToggleGroup v-model="local.company">
        <ToggleGroupCollapse :limit="5">
          <ToggleGroupItem v-for="company in favorites.companies" :key="company" :value="company">
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
    <Button v-if="hasLocalFilters" variant="destructive" @click="reset">
      <X :size="14" />
      Сбросить
    </Button>
    <Button class="applyButton" @click="apply"> Применить фильтры </Button>
  </div>
</template>

<style scoped>
.filters {
  display: grid;
  gap: 18px;
}

.salary {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: start;
}

.salaryRow {
  display: grid;
  grid-template-columns: 1fr 70px;
  gap: 10px;
}

.footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

@media (max-width: 640px) {
  .applyButton {
    width: 100%;
  }
}
</style>
