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

/* ---------------- per page ---------------- */

export type PerPageKeys = 100 | 20 | 50;

export const PER_PAGE_CONFIG: Record<PerPageKeys, string> = {
  20: '20 вакансий',
  50: '50 вакансий',
  100: '100 вакансий'
} as const;

/* ---------------- order ---------------- */

export const ORDER_CONFIG: Record<JobsOrderBy, string> = {
  relevance: 'По соответствию',
  publication_time: 'По дате',
  salary_asc: 'Низкая зарплата',
  salary_desc: 'Высокая зарплата'
} as const;

/* ---------------- period ---------------- */

export const PERIOD_CONFIG: Record<JobPeriod, string> = {
  '1': 'За день',
  '3': 'За 3 дня',
  '7': 'За неделю',
  '30': 'За месяц'
} as const;

/* ---------------- currency ---------------- */

export const CURRENCY_CONFIG: Record<CurrencyQuery, { label: string; icon: Component }> = {
  RUR: {
    label: '₽',
    icon: RussianRuble
  },
  USD: {
    label: '$',
    icon: DollarSign
  },
  EUR: {
    label: '€',
    icon: Euro
  }
} as const;

/* ---------------- experience ---------------- */

export const EXPERIENCE_CONFIG: Record<JobsExperience, string> = {
  noExperience: 'Без опыта',
  between1And3: '1-3 года',
  between3And6: '3-6 лет',
  moreThan6: '6+ лет'
} as const;

/* ---------------- employment ---------------- */

export const EMPLOYMENT_CONFIG: Record<EmploymentForm, string> = {
  FULL: 'Полная занятость',
  PART: 'Частичная занятость',
  PROJECT: 'Проект',
  FLY_IN_FLY_OUT: 'Вахта',
  SIDE_JOB: 'Подработка'
} as const;

/* ---------------- work format ---------------- */

export const WORK_FORMAT_CONFIG: Record<WorkFormat, string> = {
  REMOTE: 'Удаленно',
  FIELD_WORK: 'Разъездной',
  HYBRID: 'Гибрид',
  ON_SITE: 'На месте работодателя'
} as const;
