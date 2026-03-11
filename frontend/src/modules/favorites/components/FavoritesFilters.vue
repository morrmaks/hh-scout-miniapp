<script setup lang="ts">
import { reactive, watch } from 'vue';

import Button from '@/common/ui/Button.vue';
import Checkbox from '@/common/ui/Checkbox.vue';
import FilterGroup from '@/common/ui/FilterGroup.vue';
import InputNumber from '@/common/ui/InputNumber.vue';
import Select from '@/common/ui/Select.vue';
import Separator from '@/common/ui/Separator.vue';
import ToggleGroup from '@/common/ui/ToggleGroup.vue';
import { AreaSelect, useAreasStore } from '@/modules/areas';

import type { JobsFilters, JobsQueryParams } from '../types/jobs.types';

import {
  currencyOptions,
  employmentOptions,
  experienceOptions,
  orderByOptions,
  periodOptions,
  perPageOptions,
  workFormatOptions
} from '../config/jobsFilters.options';
import { toApiFilters, toLocalFilters } from '../lib/filters';

interface Props {
  modelValue: JobsQueryParams;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  apply: [JobsQueryParams];
}>();

const local = reactive<JobsFilters>(toLocalFilters(props.modelValue));

watch(
  () => props.modelValue,
  (v) => {
    const mapped = toLocalFilters(v);
    Object.assign(local, mapped);
  }
);

function apply() {
  emit('apply', toApiFilters(local));
}

function toggleSalary(enabled: boolean) {
  const labels = new Set(local.label ?? []);

  if (enabled) labels.add('with_salary');
  else labels.delete('with_salary');

  local.label = Array.from(labels);
}

const areasStore = useAreasStore();
</script>

<template>
  <div class="filters">
    <!-- Результаты -->
    <FilterGroup label="Показывать на странице">
      <Select v-model="local.per_page" :options="perPageOptions" />
    </FilterGroup>

    <FilterGroup label="Сортировка">
      <Select v-model="local.order_by" :options="orderByOptions" />
    </FilterGroup>

    <FilterGroup label="Период">
      <Select v-model="local.period" :options="periodOptions" />
    </FilterGroup>

    <Separator />

    <!-- Зарплата -->
    <FilterGroup label="Зарплата от">
      <div class="salary">
        <div class="salaryRow">
          <InputNumber v-model="local.salary" placeholder="100000" />

          <Select v-model="local.currency" :options="currencyOptions" />
        </div>

        <Checkbox
          :model-value="local.label?.includes('with_salary')"
          label="Только с зарплатой"
          @update:model-value="toggleSalary"
        />
      </div>
    </FilterGroup>

    <Separator />

    <!-- Требования -->
    <FilterGroup label="Опыт">
      <ToggleGroup v-model="local.experience" :options="experienceOptions" />
    </FilterGroup>

    <FilterGroup label="Тип занятости">
      <ToggleGroup v-model="local.employment_form" :options="employmentOptions" />
    </FilterGroup>

    <Separator />

    <!-- Формат -->
    <FilterGroup label="Формат работы">
      <ToggleGroup v-model="local.work_format" :options="workFormatOptions" />
    </FilterGroup>

    <Separator />

    <!-- Локация -->
    <FilterGroup label="Регион">
      <AreaSelect v-model="local.area" :areas="areasStore.items" />
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
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .applyButton {
    width: 100%;
  }
}
</style>
