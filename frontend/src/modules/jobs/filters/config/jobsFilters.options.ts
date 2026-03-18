import type { Component } from 'vue';

import { DollarSign, Euro, RussianRuble } from 'lucide-vue-next';

import type {
  CurrencyQuery,
  EmploymentForm,
  JobPeriod,
  JobsExperience,
  JobsOrderBy,
  WorkFormat
} from '@/common/api/generated';

interface Option<T extends number | string> {
  icon?: Component;
  label: string;
  value: T;
}

export const perPageOptions: Option<number>[] = [
  { label: '20 вакансий', value: 20 },
  { label: '50 вакансий', value: 50 },
  { label: '100 вакансий', value: 100 }
];

export const orderByOptions: Option<JobsOrderBy>[] = [
  { label: 'По соответствию', value: 'relevance' },
  { label: 'По дате', value: 'publication_time' },
  { label: 'Низкая зарплата', value: 'salary_asc' },
  { label: 'Высокая зарплата', value: 'salary_desc' }
];

export const periodOptions: Option<JobPeriod>[] = [
  { label: 'любой', value: '' },
  { label: 'За день', value: '1' },
  { label: 'За 3 дня', value: '3' },
  { label: 'За неделю', value: '7' },
  { label: 'За месяц', value: '30' }
];

export const currencyOptions: Option<CurrencyQuery>[] = [
  { label: '', value: 'RUR', icon: RussianRuble },
  { label: '', value: 'USD', icon: DollarSign },
  { label: '', value: 'EUR', icon: Euro }
];

export const experienceOptions: Option<JobsExperience>[] = [
  { label: 'Без опыта', value: 'noExperience' },
  { label: '1-3 года', value: 'between1And3' },
  { label: '3-6 лет', value: 'between3And6' },
  { label: '6+ лет', value: 'moreThan6' }
];

export const employmentOptions: Option<EmploymentForm>[] = [
  { label: 'Полная занятость', value: 'FULL' },
  { label: 'Частичная занятость', value: 'PART' },
  { label: 'Проект', value: 'PROJECT' },
  { label: 'Вахта', value: 'FLY_IN_FLY_OUT' },
  { label: 'Подработка', value: 'SIDE_JOB' }
];

export const workFormatOptions: Option<WorkFormat>[] = [
  { label: 'Удаленно', value: 'REMOTE' },
  { label: 'Разъездной', value: 'FIELD_WORK' },
  { label: 'Гибрид', value: 'HYBRID' },
  { label: 'На месте работодателя', value: 'ON_SITE' }
];
