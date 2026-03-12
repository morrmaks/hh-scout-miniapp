import type { GetFavoritesData } from '@/common/api/generated';

export type FavoritesQuery = GetFavoritesData['query'];

export type FavoritesFilters = Omit<GetFavoritesData['query'], 'page' | 'per_page' | 'userId'>;

export type FavoritesFiltersKeys = keyof FavoritesFilters;
