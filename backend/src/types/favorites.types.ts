import type { Favorite, Status } from '@prisma/client';

export type FavoriteSort =
  | 'created_asc'
  | 'created_desc'
  | 'published_asc'
  | 'published_desc'
  | 'salary_asc'
  | 'salary_desc'
  | 'status';

export type FavoritesLabel = 'same_currency' | 'with_salary';
export type Currency = 'EUR' | 'RUR' | 'USD';

export interface LoadFavoritesQuery {
  company?: string | string[];
  currency?: Currency;
  experience?: string[];
  label?: FavoritesLabel | FavoritesLabel[];
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

  items: (Favorite & { status: Status | null })[];

  meta: {
    total: number;
    page: number;
    pages: number;
  };
}
