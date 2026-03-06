<script setup lang="ts">
import { reactive, watch } from 'vue';

import Button from '@/common/ui/Button.vue';
import FilterGroup from '@/common/ui/FilterGroup.vue';
import InputNumber from '@/common/ui/InputNumber.vue';
import Select from '@/common/ui/Select.vue';

import type { LocalFilters } from '../lib/filtersMapper';
import type { JobFilters } from '../types/jobsFilters';

import { toApiFilters, toLocalFilters } from '../lib/filtersMapper';

interface Props {
  modelValue: JobFilters;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  apply: [JobFilters];
}>();

const local = reactive<LocalFilters>(toLocalFilters(props.modelValue));

watch(
  () => props.modelValue,
  (v) => Object.assign(local, toLocalFilters(v))
);

function apply() {
  emit('apply', toApiFilters(local));
}
</script>

<template>
  <div class="filters">
    <FilterGroup label="Сортировка">
      <Select
        v-model="local.order_by"
        :options="[
          { label: 'По релевантности', value: 'relevance' },
          { label: 'По дате', value: 'publication_time' },
          { label: 'Зарплата ↑', value: 'salary_asc' },
          { label: 'Зарплата ↓', value: 'salary_desc' }
        ]"
      />
    </FilterGroup>

    <FilterGroup label="Зарплата от">
      <InputNumber v-model="local.salary" placeholder="100000" />
    </FilterGroup>

    <FilterGroup label="Опыт">
      <Select
        v-model="local.experience"
        :options="[
          { label: 'Без опыта', value: 'noExperience' },
          { label: '1-3 года', value: 'between1And3' },
          { label: '3-6 лет', value: 'between3And6' },
          { label: '6+ лет', value: 'moreThan6' }
        ]"
      />
    </FilterGroup>

    <FilterGroup label="Тип занятости">
      <Select
        v-model="local.employment_form"
        :options="[
          { label: 'Полная занятость', value: 'full' },
          { label: 'Частичная', value: 'part' },
          { label: 'Проект', value: 'project' }
        ]"
      />
    </FilterGroup>

    <FilterGroup label="Формат работы">
      <Select
        v-model="local.work_format"
        :options="[
          { label: 'Удаленно', value: 'remote' },
          { label: 'Офис', value: 'office' },
          { label: 'Гибрид', value: 'hybrid' }
        ]"
      />
    </FilterGroup>

    <FilterGroup label="Регион">
      <Select
        v-model="local.area"
        :options="[
          { label: 'Москва', value: '1' },
          { label: 'Санкт-Петербург', value: '2' }
        ]"
      />
    </FilterGroup>

    <FilterGroup label="Период">
      <Select
        v-model="local.period"
        :options="[
          { label: 'За день', value: '1' },
          { label: 'За 3 дня', value: '3' },
          { label: 'За неделю', value: '7' },
          { label: 'За месяц', value: '30' }
        ]"
      />
    </FilterGroup>
  </div>

  <div class="footer">
    <Button @click="apply"> Применить фильтры </Button>
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
</style>
