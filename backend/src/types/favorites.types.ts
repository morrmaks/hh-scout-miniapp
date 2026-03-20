import type { Favorite, Status } from '@prisma/client';

export type FavoriteSort =
  | 'created_asc'
  | 'created_desc'
  | 'published_asc'
  | 'published_desc'
  | 'salary_asc'
  | 'salary_desc';

export type FavoritesLabel = 'same_currency' | 'with_salary';
export type FavoriteCurrency = 'EUR' | 'RUR' | 'USD';

export interface LoadFavoritesQuery {
  company?: string | string[];
  currency?: FavoriteCurrency;
  experience?: string[];
  label?: FavoritesLabel[];
  page?: string;
  per_page?: string;
  salary_from?: string;
  sort?: FavoriteSort;
  status?: string | string[];
  text?: string;
}

export interface FavoritesResponse {
  filters?: {
    companies: string[];
    statuses: Status[];
  };

  items: (Favorite & { statusId: number | null })[];

  meta: {
    totalAll: number;
    totalFound: number;
    page: number;
    pages: number;
  };
}
