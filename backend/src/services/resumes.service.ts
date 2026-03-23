import { prisma } from '../db/prisma';

export const DEFAULT_STATUSES = [
  { name: 'Отклик', color: 'blue' },
  { name: 'Собеседование', color: 'purple' },
  { name: 'Тестовое', color: 'orange' },
  { name: 'Оффер', color: 'green' },
  { name: 'Отказ', color: 'red' }
];

export async function loadResumes(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { id: 'asc' }
  });
}

export async function createResume(userId: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Resume name is required');

  return prisma.$transaction(async (tx) => {
    const resume = await tx.resume.create({
      data: {
        userId,
        name: trimmed
      }
    });

    const exists = await tx.status.findFirst({
      where: { userId },
      select: { id: true }
    });

    if (!exists) {
      await tx.status.createMany({
        data: DEFAULT_STATUSES.map((s) => ({
          userId,
          name: s.name,
          color: s.color
        }))
      });
    }

    return resume;
  });
}

export async function updateResume(userId: string, resumeId: number, name?: string) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId
    }
  });

  if (!resume) throw new Error('Resume not found');

  const data: { name?: string } = {};

  if (name !== undefined) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Resume name is required');

    data.name = trimmed;
  }

  const resumeUpdated = await prisma.resume.update({
    where: { id: resumeId },
    data
  });

  return { id: resumeUpdated.id, name: resumeUpdated.name };
}

export async function deleteResume(userId: string, resumeId: number) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
    select: { id: true }
  });

  if (!resume) throw new Error('Resume not found');

  await prisma.$transaction(async (tx) => {
    await tx.application.deleteMany({
      where: { resumeId }
    });

    await tx.favorite.deleteMany({
      where: {
        userId,
        applications: {
          none: {}
        }
      }
    });

    await tx.resume.delete({
      where: { id: resumeId }
    });
  });

  return true;
}
