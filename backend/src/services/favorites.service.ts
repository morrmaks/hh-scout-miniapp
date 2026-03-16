import type { Prisma } from '@prisma/client';

import type {
  FavoritesLabel,
  FavoritesResponse,
  LoadFavoritesQuery
} from '../types/favorites.types';

import { pushAnd } from '../db';
import { prisma } from '../db/prisma';
import { toFavoriteJob } from '../dto/favoriteJob.dto';
import { getCurrencyRates } from '../integrations/currency';
import { generateFavoritesExcel } from '../integrations/excel';
import { convertCurrency } from '../utils/currency';
import { getJobById } from './jobs.service';

const DEFAULT_PER_PAGE = 20;

export const DEFAULT_STATUSES = [
  { name: 'Отклик', color: 'blue' },
  { name: 'Собеседование', color: 'purple' },
  { name: 'Тестовое', color: 'orange' },
  { name: 'Оффер', color: 'green' },
  { name: 'Отказ', color: 'red' }
];

async function ensureDefaultStatuses(userId: number) {
  const exists = await prisma.status.findFirst({
    where: { userId },
    select: { id: true }
  });

  if (exists) return;

  await prisma.status.createMany({
    data: DEFAULT_STATUSES.map((s) => ({
      userId,
      name: s.name,
      color: s.color
    }))
  });
}

export async function saveFavorite(userId: number, jobId: string, resumeIds: number[]) {
  await ensureDefaultStatuses(userId);

  const job = await getJobById(jobId);
  const fav = toFavoriteJob(job);

  const rates = await getCurrencyRates();

  const salaryValue = fav.salaryTo ?? fav.salaryFrom ?? null;

  const salaryBase =
    salaryValue && fav.currency
      ? Math.round(convertCurrency(salaryValue, fav.currency, 'RUR', rates))
      : null;

  const favorite = await prisma.favorite.upsert({
    where: {
      userId_jobId: { userId, jobId }
    },

    update: {
      title: fav.title,
      company: fav.company,
      url: fav.url,
      salaryFrom: fav.salaryFrom,
      salaryTo: fav.salaryTo,
      currency: fav.currency,
      salaryBase,
      experience: fav.experience,
      publishedAt: fav.publishedAt
    },

    create: {
      userId,
      jobId,
      title: fav.title,
      company: fav.company,
      url: fav.url,
      salaryFrom: fav.salaryFrom,
      salaryTo: fav.salaryTo,
      currency: fav.currency,
      salaryBase,
      experience: fav.experience,
      publishedAt: fav.publishedAt
    }
  });

  await prisma.application.createMany({
    data: resumeIds.map((resumeId) => ({
      userId,
      favoriteId: favorite.id,
      resumeId
    })),
    skipDuplicates: true
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

export async function deleteFavorite(userId: number, jobId: string, resumeIds: number[]) {
  const fav = await prisma.favorite.findFirst({
    where: { userId, jobId }
  });

  if (!fav) return;

  await prisma.application.deleteMany({
    where: {
      userId,
      favoriteId: fav.id,
      resumeId: { in: resumeIds }
    }
  });

  const applicationsLeft = await prisma.application.count({
    where: { favoriteId: fav.id }
  });

  if (applicationsLeft > 0) return;

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
  const rows = await prisma.favorite.findMany({
    where: { userId },
    select: { jobId: true }
  });

  return rows.map((r) => r.jobId);
}

export async function loadFavorites(
  userId: number,
  resumeId: number,
  query: LoadFavoritesQuery
): Promise<FavoritesResponse> {
  const hasSalary = query.salary_from && Number(query.salary_from) > 0;

  const labels: FavoritesLabel[] = query.label
    ? Array.isArray(query.label)
      ? query.label
      : [query.label]
    : [];

  const effectiveLabels = hasSalary ? labels : labels.filter((l) => l !== 'same_currency');

  const page = Number(query.page ?? 1);
  const perPage = Math.min(Number(query.per_page ?? DEFAULT_PER_PAGE), 100);
  const skip = (page - 1) * perPage;

  const applicationFilter: Prisma.ApplicationWhereInput = {
    resumeId
  };

  if (query.status) {
    const statuses = Array.isArray(query.status)
      ? query.status.map(Number)
      : [Number(query.status)];

    applicationFilter.statusId = { in: statuses };
  }

  const where: Prisma.FavoriteWhereInput = {
    userId,
    applications: {
      some: applicationFilter
    }
  };

  if (query.text) {
    const text = query.text.trim();

    pushAnd(where, {
      OR: [
        { title: { contains: text, mode: 'insensitive' } },
        { company: { contains: text, mode: 'insensitive' } },
        { url: { contains: text, mode: 'insensitive' } }
      ]
    });
  }

  const salaryFilter: Prisma.IntNullableFilter = {};

  if (effectiveLabels.includes('with_salary')) salaryFilter.not = null;

  if (hasSalary) {
    const salary = Number(query.salary_from);

    const rates = await getCurrencyRates();

    const baseSalary = Math.round(convertCurrency(salary, query.currency ?? 'RUR', 'RUR', rates));

    salaryFilter.gte = baseSalary;
  }

  if (Object.keys(salaryFilter).length) where.salaryBase = salaryFilter;

  if (effectiveLabels.includes('same_currency') && query.currency) where.currency = query.currency;

  if (query.company) {
    const companies = Array.isArray(query.company) ? query.company : [query.company];

    where.company = { in: companies };
  }

  if (query.experience) {
    const exp = Array.isArray(query.experience) ? query.experience : [query.experience];

    where.experience = { in: exp };
  }

  const orderBy:
    | Prisma.FavoriteOrderByWithRelationInput
    | Prisma.FavoriteOrderByWithRelationInput[] = (() => {
    switch (query.sort) {
      case 'salary_asc':
        return {
          salaryBase: {
            sort: 'asc',
            nulls: 'first'
          }
        };

      case 'salary_desc':
        return {
          salaryBase: {
            sort: 'desc',
            nulls: 'last'
          }
        };

      case 'published_asc':
        return { publishedAt: 'asc' };

      case 'published_desc':
        return { publishedAt: 'desc' };

      case 'created_asc':
        return { createdAt: 'asc' };

      case 'created_desc':
      default:
        return { createdAt: 'desc' };
    }
  })();

  const [favorites, totalFound, totalAll] = await Promise.all([
    prisma.favorite.findMany({
      where,
      skip,
      take: perPage,
      orderBy,
      include: {
        applications: {
          where: { resumeId },
          select: {
            statusId: true
          }
        }
      }
    }),

    prisma.favorite.count({ where }),

    prisma.favorite.count({
      where: { userId }
    })
  ]);

  const items = favorites.map((f) => {
    const app = f.applications[0];

    return {
      id: f.id,
      userId: f.userId,
      jobId: f.jobId,
      title: f.title,
      company: f.company,
      url: f.url,
      salaryFrom: f.salaryFrom,
      salaryTo: f.salaryTo,
      currency: f.currency,
      salaryBase: f.salaryBase,
      experience: f.experience,
      publishedAt: f.publishedAt,
      createdAt: f.createdAt,
      statusId: app?.statusId ?? null
    };
  });

  const result: FavoritesResponse = {
    items,
    meta: {
      totalAll,
      totalFound,
      page,
      pages: Math.ceil(totalFound / perPage)
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

export async function setFavoriteStatus(
  userId: number,
  jobId: string,
  resumeId: number,
  statusId: number | null
) {
  const fav = await prisma.favorite.findFirst({
    where: { userId, jobId },
    select: { id: true }
  });

  if (!fav) return;

  return prisma.application.update({
    where: {
      favoriteId_resumeId: {
        favoriteId: fav.id,
        resumeId
      }
    },
    data: { statusId }
  });
}

export async function exportExcel(userId: number, resumeId: number) {
  const [favorites, statuses] = await Promise.all([
    prisma.favorite.findMany({
      where: {
        userId,
        applications: {
          some: { resumeId }
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        applications: {
          where: { resumeId },
          include: { status: true }
        }
      }
    }),

    prisma.status.findMany({
      where: { userId },
      orderBy: { id: 'asc' }
    })
  ]);

  const normalized = favorites.map((f) => ({
    ...f,
    status: f.applications[0]?.status ?? null
  }));

  return generateFavoritesExcel(normalized, statuses);
}
