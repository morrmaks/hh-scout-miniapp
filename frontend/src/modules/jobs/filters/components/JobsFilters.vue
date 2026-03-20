<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { computed, reactive, watch } from 'vue';

import Button from '@/common/ui/Button.vue';
import Checkbox from '@/common/ui/Checkbox.vue';
import FilterGroup from '@/common/ui/FilterGroup.vue';
import InputNumber from '@/common/ui/InputNumber.vue';
import Select from '@/common/ui/Select.vue';
import Separator from '@/common/ui/Separator.vue';
import { ToggleGroup, ToggleGroupItem } from '@/common/ui/ToggleGroup';
import { equalObjects } from '@/common/utils/object';
import { AreaSelect, useAreasStore } from '@/modules/areas';

import type { JobsFiltersType, JobsQueryParams } from '../../types/jobs.types';

import { useJobsStore } from '../../store/jobs.store';
import { DEFAULT_FILTERS } from '../config/jobsFilters.default';
import {
  currencyOptions,
  employmentOptions,
  experienceOptions,
  periodOptions,
  workFormatOptions
} from '../config/jobsFilters.options';
const emit = defineEmits<{
  apply: [JobsQueryParams];
  reset: [];
}>();

const store = useJobsStore();
const local = reactive<JobsFiltersType>({
  ...store.filters
});

const hasLocalChanges = computed(() => !equalObjects(local, DEFAULT_FILTERS));

function reset() {
  Object.assign(local, DEFAULT_FILTERS);
  store.resetFilters();
  emit('reset');
}

watch(
  () => store.filters,
  (v) => Object.assign(local, v)
);

function apply() {
  emit('apply', { ...local });
}

function toggleSalaryLabel(enabled: boolean) {
  const labels = new Set(local.label ?? []);

  if (enabled) labels.add('with_salary');
  else labels.delete('with_salary');

  local.label = [...labels];
}

const areasStore = useAreasStore();
</script>

<template>
  <div class="filters">
    <FilterGroup label="Период">
      <Select v-model="local.period" :options="periodOptions" />
    </FilterGroup>

    <Separator />

    <!-- Зарплата -->
    <FilterGroup label="Зарплата от">
      <div class="salary">
        <div class="salaryRow">
          <InputNumber v-model="local.salary" placeholder="100000" />

          <Select v-model="local.currency" :options="currencyOptions" class="currency" />
        </div>

        <Checkbox
          :model-value="local.label?.includes('with_salary')"
          label="Только с зарплатой"
          @update:model-value="toggleSalaryLabel"
        />
      </div>
    </FilterGroup>

    <Separator />

    <FilterGroup label="Опыт">
      <ToggleGroup v-model="local.experience">
        <ToggleGroupItem v-for="o in experienceOptions" :key="o.value" :value="o.value">
          {{ o.label }}
        </ToggleGroupItem>
      </ToggleGroup>
    </FilterGroup>

    <FilterGroup label="Тип занятости">
      <ToggleGroup v-model="local.employment_form">
        <ToggleGroupItem v-for="o in employmentOptions" :key="o.value" :value="o.value">
          {{ o.label }}
        </ToggleGroupItem>
      </ToggleGroup>
    </FilterGroup>

    <Separator />

    <!-- Формат -->
    <FilterGroup label="Формат работы">
      <ToggleGroup v-model="local.work_format">
        <ToggleGroupItem v-for="o in workFormatOptions" :key="o.value" :value="o.value">
          {{ o.label }}
        </ToggleGroupItem>
      </ToggleGroup>
    </FilterGroup>

    <Separator />

    <!-- Локация -->
    <FilterGroup label="Регион">
      <AreaSelect v-model="local.area" :areas="areasStore.items" />
    </FilterGroup>
  </div>

  <div class="footer">
    <Button v-if="hasLocalChanges" variant="destructive" @click="reset">
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

.currency {
  display: flex;
  align-items: stretch;
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
