import type { Component } from 'vue';

import { DollarSign, Euro, RussianRuble } from 'lucide-vue-next';

import type { CurrencyQuery, FavoritesSort } from '@/common/api/generated';

interface Option<T extends number | string> {
  icon?: Component;
  label: string;
  value: T;
}

export const sortOptions: Option<FavoritesSort>[] = [
  { label: 'Добавлены недавно', value: 'created_desc' },
  { label: 'Добавлены давно', value: 'created_asc' },
  { label: 'Опубликованы недавно', value: 'published_desc' },
  { label: 'Опубликованы давно', value: 'published_asc' },
  { label: 'Высокая зарплата', value: 'salary_desc' },
  { label: 'Низкая зарплата', value: 'salary_asc' }
];

export const currencyOptions: Option<CurrencyQuery>[] = [
  { label: '', value: 'RUR', icon: RussianRuble },
  { label: '', value: 'USD', icon: DollarSign },
  { label: '', value: 'EUR', icon: Euro }
];
