import type { Prisma } from '@prisma/client';

import XLSX from 'xlsx';

import type { JobDTO } from '../dto/job.dto';
import type { FavoritesResponse, LoadFavoritesQuery } from '../types/favorites.types';

import { prisma } from '../db/prisma';
import { toFavoriteJob } from '../dto/favoriteJob.dto';

const DEFAULT_PER_PAGE = 20;
export const DEFAULT_STATUSES = [
  { name: 'Отклик', color: 'blue' },
  { name: 'Собеседование', color: 'purple' },
  { name: 'Тестовое', color: 'orange' },
  { name: 'Оффер', color: 'green' },
  { name: 'Отказ', color: 'red' }
];

async function ensureDefaultStatuses(userId: number) {
  const count = await prisma.status.count({
    where: { userId }
  });

  if (count > 0) return;

  await prisma.status.createMany({
    data: DEFAULT_STATUSES.map((s) => ({
      userId,
      name: s.name,
      color: s.color
    }))
  });
}

export async function saveFavorite(userId: number, job: JobDTO) {
  await ensureDefaultStatuses(userId);

  const fav = toFavoriteJob(job);

  const favorite = await prisma.favorite.upsert({
    where: {
      userId_jobId: {
        userId,
        jobId: fav.id
      }
    },

    update: {
      title: fav.title,
      company: fav.company,
      url: fav.url,

      salaryFrom: fav.salaryFrom,
      salaryTo: fav.salaryTo,
      currency: fav.currency,

      experience: fav.experience
    },

    create: {
      userId,

      jobId: fav.id,

      title: fav.title,
      company: fav.company,
      url: fav.url,

      salaryFrom: fav.salaryFrom,
      salaryTo: fav.salaryTo,
      currency: fav.currency,

      experience: fav.experience
    }
  });

  await prisma.company.upsert({
    where: {
      userId_name: {
        userId,
        name: fav.company
      }
    },
    update: {},
    create: {
      userId,
      name: fav.company
    }
  });

  return favorite;
}

export async function deleteFavorite(userId: number, jobId: string) {
  const fav = await prisma.favorite.findFirst({
    where: { userId, jobId }
  });

  if (!fav) return;

  await prisma.favorite.delete({
    where: { id: fav.id }
  });

  const count = await prisma.favorite.count({
    where: {
      userId,
      company: fav.company
    }
  });

  if (count === 0) {
    await prisma.company.delete({
      where: {
        userId_name: {
          userId,
          name: fav.company
        }
      }
    });
  }
}

export async function loadFavoriteIds(userId: number) {
  return prisma.favorite
    .findMany({
      where: { userId },
      select: { jobId: true }
    })
    .then((rows) => rows.map((r) => r.jobId));
}

export async function loadFavorites(userId: number, query: LoadFavoritesQuery) {
  const page = Number(query.page ?? 1);
  const perPage = Math.min(Number(query.per_page ?? DEFAULT_PER_PAGE), 100);

  const skip = (page - 1) * perPage;

  const where: Prisma.FavoriteWhereInput = { userId };

  if (query.salary_from) {
    where.salaryFrom = {
      gte: Number(query.salary_from)
    };
  }

  if (query.company) {
    const companies = Array.isArray(query.company) ? query.company : [query.company];

    where.company = {
      in: companies
    };
  }

  if (query.status) {
    const statuses = Array.isArray(query.status)
      ? query.status.map(Number)
      : [Number(query.status)];

    where.statusId = {
      in: statuses
    };
  }

  const orderBy: Prisma.FavoriteOrderByWithRelationInput = (() => {
    switch (query.sort) {
      case 'salary_asc':
        return { salaryFrom: 'asc' };

      case 'salary_desc':
        return { salaryFrom: 'desc' };

      case 'status':
        return { statusId: 'asc' };

      default:
        return { createdAt: 'desc' };
    }
  })();

  const [items, total] = await Promise.all([
    prisma.favorite.findMany({
      where,
      skip,
      take: perPage,
      orderBy,
      include: {
        status: true
      }
    }),

    prisma.favorite.count({ where })
  ]);

  const result: FavoritesResponse = {
    items,
    meta: {
      total,
      page,
      pages: Math.ceil(total / perPage)
    }
  };

  if (page === 1) {
    const [companies, statuses] = await Promise.all([
      prisma.company.findMany({
        where: { userId },
        orderBy: { name: 'asc' }
      }),

      prisma.status.findMany({
        where: { userId },
        orderBy: { id: 'asc' }
      })
    ]);

    result.filters = {
      companies: companies.map((c) => c.name),
      statuses
    };
  }

  return result;
}

export async function setFavoriteStatus(userId: number, jobId: string, statusId: number | null) {
  return prisma.favorite.updateMany({
    where: {
      userId,
      jobId
    },
    data: {
      statusId
    }
  });
}

export async function exportExcel(userId: number) {
  const list = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  const rows = list.map((j) => ({
    Title: j.title,
    Company: j.company,
    URL: j.url,
    SalaryFrom: j.salaryFrom,
    SalaryTo: j.salaryTo,
    Currency: j.currency,
    Experience: j.experience
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'Favorites');

  const buffer = XLSX.write(wb, {
    type: 'buffer',
    bookType: 'xlsx'
  });

  return buffer;
}
