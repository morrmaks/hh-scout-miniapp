import type { Component } from 'vue';

import type {
  CurrencyQuery,
  EmploymentForm,
  JobPeriod,
  JobsExperience,
  JobsOrderBy,
  WorkFormat
} from '@/common/api/generated';

import type { PerPageKeys } from './filters.config';

import {
  CURRENCY_CONFIG,
  EMPLOYMENT_CONFIG,
  EXPERIENCE_CONFIG,
  ORDER_CONFIG,
  PER_PAGE_CONFIG,
  PERIOD_CONFIG,
  WORK_FORMAT_CONFIG
} from './filters.config';

interface Option<T extends number | string> {
  icon?: Component;
  label: string;
  value: T;
}

export const perPageOptions: Option<PerPageKeys>[] = [
  { value: 20, label: PER_PAGE_CONFIG[20] },
  { value: 50, label: PER_PAGE_CONFIG[50] },
  { value: 100, label: PER_PAGE_CONFIG[100] }
];

export const orderByOptions: Option<JobsOrderBy>[] = [
  { value: 'relevance', label: ORDER_CONFIG.relevance },
  { value: 'publication_time', label: ORDER_CONFIG.publication_time },
  { value: 'salary_asc', label: ORDER_CONFIG.salary_asc },
  { value: 'salary_desc', label: ORDER_CONFIG.salary_desc }
];

export const periodOptions: Option<JobPeriod>[] = [
  { value: '1', label: PERIOD_CONFIG['1'] },
  { value: '3', label: PERIOD_CONFIG['3'] },
  { value: '7', label: PERIOD_CONFIG['7'] },
  { value: '30', label: PERIOD_CONFIG['30'] }
];

export const currencyOptions: Option<CurrencyQuery>[] = [
  { value: 'RUR', label: '', icon: CURRENCY_CONFIG.RUR.icon },
  { value: 'USD', label: '', icon: CURRENCY_CONFIG.USD.icon },
  { value: 'EUR', label: '', icon: CURRENCY_CONFIG.EUR.icon }
];

export const experienceOptions: Option<JobsExperience>[] = [
  { value: 'noExperience', label: EXPERIENCE_CONFIG.noExperience },
  { value: 'between1And3', label: EXPERIENCE_CONFIG.between1And3 },
  { value: 'between3And6', label: EXPERIENCE_CONFIG.between3And6 },
  { value: 'moreThan6', label: EXPERIENCE_CONFIG.moreThan6 }
];

export const employmentOptions: Option<EmploymentForm>[] = [
  { value: 'FULL', label: EMPLOYMENT_CONFIG.FULL },
  { value: 'PART', label: EMPLOYMENT_CONFIG.PART },
  { value: 'PROJECT', label: EMPLOYMENT_CONFIG.PROJECT },
  { value: 'FLY_IN_FLY_OUT', label: EMPLOYMENT_CONFIG.FLY_IN_FLY_OUT },
  { value: 'SIDE_JOB', label: EMPLOYMENT_CONFIG.SIDE_JOB }
];

export const workFormatOptions: Option<WorkFormat>[] = [
  { value: 'REMOTE', label: WORK_FORMAT_CONFIG.REMOTE },
  { value: 'FIELD_WORK', label: WORK_FORMAT_CONFIG.FIELD_WORK },
  { value: 'HYBRID', label: WORK_FORMAT_CONFIG.HYBRID },
  { value: 'ON_SITE', label: WORK_FORMAT_CONFIG.ON_SITE }
];
