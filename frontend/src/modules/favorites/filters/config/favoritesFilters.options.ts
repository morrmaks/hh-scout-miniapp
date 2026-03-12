import type { FavoritesSort } from '@/common/api/generated';

interface Option<T extends number | string> {
  label: string;
  value: T;
}

export const sortOptions: Option<FavoritesSort>[] = [
  { label: 'По дате добавления', value: 'created_desc' },
  { label: 'По дате публикации', value: 'published_desc' },
  { label: 'Зарплата ↑', value: 'salary_asc' },
  { label: 'Зарплата ↓', value: 'salary_desc' },
  { label: 'По статусу', value: 'status' }
];
