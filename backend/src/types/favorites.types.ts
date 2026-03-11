import type { Favorite, Status } from '@prisma/client';

export type FavoriteSort =
  | 'created_desc'
  | 'published_desc'
  | 'salary_asc'
  | 'salary_desc'
  | 'status';

export interface LoadFavoritesQuery {
  company?: string | string[];
  experience?: string[];
  page?: string;
  per_page?: string;
  salary_from?: string;
  sort?: FavoriteSort;
  status?: string | string[];
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
