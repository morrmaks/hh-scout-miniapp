import { prisma } from '../db/prisma';

export async function loadResumes(userId: number) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { id: 'asc' }
  });
}

export async function createResume(userId: number, name: string) {
  const trimmed = name.trim();

  if (!trimmed) throw new Error('Resume name is required');

  return prisma.resume.create({
    data: {
      userId,
      name: trimmed
    }
  });
}

export async function updateResume(userId: number, resumeId: number, name?: string) {
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

export async function deleteResume(userId: number, resumeId: number) {
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
