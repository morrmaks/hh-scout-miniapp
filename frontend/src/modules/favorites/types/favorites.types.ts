import type { GetFavoritesData } from '@/common/api/generated';

export type FavoritesQuery = GetFavoritesData['query'];

export type FavoritesFiltersType = Omit<
  NonNullable<FavoritesQuery>,
  'page' | 'per_page' | 'resumeId' | 'sort' | 'text' | 'userId'
>;

export type FavoritesFiltersKeys = keyof FavoritesFiltersType;
