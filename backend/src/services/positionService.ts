import { prisma } from "../db/prisma"

export async function savePosition(
  userId: number,
  page: number,
  index: number,
  query: string
) {

  await prisma.position.upsert({
    where: { userId },
    update: {
      page,
      index,
      query
    },
    create: {
      userId,
      page,
      index,
      query
    }
  })
}

export async function loadPosition(userId: number) {

  return prisma.position.findUnique({
    where: { userId }
  })
}