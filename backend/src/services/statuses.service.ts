import { prisma } from '../db/prisma';

export async function getStatuses(userId: number) {
  return prisma.status.findMany({
    where: { userId },
    orderBy: { id: 'asc' }
  });
}

export async function createStatus(userId: number, name: string, color: string) {
  if (!name?.trim()) {
    throw new Error('Status name is required');
  }

  return prisma.status.create({
    data: {
      userId,
      name: name.trim(),
      color
    }
  });
}

export async function updateStatus(id: number, name?: string, color?: string) {
  const status = await prisma.status.findUnique({
    where: { id }
  });

  if (!status) {
    throw new Error('Status not found');
  }

  return prisma.status.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(color !== undefined && { color })
    }
  });
}

export async function deleteStatus(id: number) {
  const status = await prisma.status.findUnique({
    where: { id }
  });

  if (!status) return;

  await prisma.application.updateMany({
    where: { statusId: id },
    data: { statusId: null }
  });

  await prisma.status.delete({
    where: { id }
  });
}
