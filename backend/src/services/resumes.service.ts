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

export async function deleteResume(userId: number, resumeId: number) {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId
    },
    select: { id: true }
  });

  if (!resume) throw new Error('Resume not found');

  await prisma.application.deleteMany({
    where: { resumeId }
  });

  await prisma.resume.delete({
    where: { id: resumeId }
  });

  return true;
}
