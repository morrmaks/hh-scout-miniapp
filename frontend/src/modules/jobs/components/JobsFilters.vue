<script setup lang="ts">
import { DollarSign, Euro, RussianRuble } from 'lucide-vue-next';
import { reactive, watch } from 'vue';

import Button from '@/common/ui/Button.vue';
import Checkbox from '@/common/ui/Checkbox.vue';
import FilterGroup from '@/common/ui/FilterGroup.vue';
import InputNumber from '@/common/ui/InputNumber.vue';
import Select from '@/common/ui/Select.vue';
import Separator from '@/common/ui/Separator.vue';
import ToggleGroup from '@/common/ui/ToggleGroup.vue';
import { AreaSelect, useAreasStore } from '@/modules/areas';

import type { LocalFilters } from '../lib/filters';
import type { JobsFiltersType } from '../types/jobs.types';

import { toApiFilters, toLocalFilters } from '../lib/filters';

interface Props {
  modelValue: JobsFiltersType;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  apply: [JobsFiltersType];
}>();

const local = reactive<LocalFilters>(toLocalFilters(props.modelValue));

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
      <Select
        v-model="local.per_page"
        :options="[
          { label: '20 вакансий', value: 20 },
          { label: '50 вакансий', value: 50 },
          { label: '100 вакансий', value: 100 }
        ]"
      />
    </FilterGroup>

    <FilterGroup label="Сортировка">
      <Select
        v-model="local.order_by"
        :options="[
          { label: 'По соответствию', value: 'relevance' },
          { label: 'По дате', value: 'publication_time' },
          { label: 'Зарплата ↑', value: 'salary_asc' },
          { label: 'Зарплата ↓', value: 'salary_desc' }
        ]"
      />
    </FilterGroup>

    <FilterGroup label="Период">
      <Select
        v-model="local.period"
        :options="[
          { label: 'любой', value: 0 },
          { label: 'За день', value: 1 },
          { label: 'За 3 дня', value: 3 },
          { label: 'За неделю', value: 7 },
          { label: 'За месяц', value: 30 }
        ]"
      />
    </FilterGroup>

    <Separator />

    <!-- Зарплата -->
    <FilterGroup label="Зарплата от">
      <div class="salary">
        <div class="salaryRow">
          <InputNumber v-model="local.salary" placeholder="100000" />

          <Select
            v-model="local.currency"
            :options="[
              { label: '', value: 'RUR', icon: RussianRuble },
              { label: '', value: 'USD', icon: DollarSign },
              { label: '', value: 'EUR', icon: Euro }
            ]"
          />
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
      <Select
        v-model="local.experience"
        :options="[
          { label: 'любой', value: '' },
          { label: 'Без опыта', value: 'noExperience' },
          { label: '1-3 года', value: 'between1And3' },
          { label: '3-6 лет', value: 'between3And6' },
          { label: '6+ лет', value: 'moreThan6' }
        ]"
      />
    </FilterGroup>

    <FilterGroup label="Тип занятости">
      <ToggleGroup
        v-model="local.employment_form"
        :options="[
          { label: 'Полная занятость', value: 'FULL' },
          { label: 'Частичная занятость', value: 'PART' },
          { label: 'Проект', value: 'PROJECT' },
          { label: 'Вахта', value: 'FLY_IN_FLY_OUT' },
          { label: 'Подработка', value: 'SIDE_JOB' }
        ]"
      />
    </FilterGroup>

    <Separator />

    <!-- Формат -->
    <FilterGroup label="Формат работы">
      <ToggleGroup
        v-model="local.work_format"
        :options="[
          { label: 'Удаленно', value: 'REMOTE' },
          { label: 'Разъездной', value: 'FIELD_WORK' },
          { label: 'Гибрид', value: 'HYBRID' },
          { label: 'На месте работодателя', value: 'ON_SITE' }
        ]"
      />
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
