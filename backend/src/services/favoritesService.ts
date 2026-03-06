import XLSX from 'xlsx';

import type { JobDTO } from '../dto/jobDto';

import { prisma } from '../db/prisma';
import { toFavoriteJob } from '../dto/favoriteJobDto';

export async function loadFavorites(userId: number) {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: { id: 'asc' }
  });
}

export async function saveFavorite(userId: number, job: JobDTO) {
  const fav = toFavoriteJob(job);

  await prisma.favorite.upsert({
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
}
export async function deleteFavorite(userId: number, jobId: string) {
  const fav = await prisma.favorite.findFirst({
    where: {
      userId,
      jobId
    }
  });

  if (!fav) return;

  await prisma.favorite.delete({
    where: { id: fav.id }
  });
}

export async function exportExcel(userId: number) {
  const list = await loadFavorites(userId);

  const rows = list.map((j) => ({
    Company: j.company,
    URL: j.url
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, 'Jobs');

  const buffer = XLSX.write(wb, {
    type: 'buffer',
    bookType: 'xlsx'
  });

  return buffer;
}
