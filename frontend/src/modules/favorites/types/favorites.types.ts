import type { GetFavoritesData } from '@/common/api/generated';

export type FavoritesQuery = GetFavoritesData['query'];

export type FavoritesFiltersType = Omit<
  GetFavoritesData['query'],
  'page' | 'per_page' | 'resumeId' | 'sort' | 'text' | 'userId'
>;

export type FavoritesFiltersKeys = keyof FavoritesFiltersType;
