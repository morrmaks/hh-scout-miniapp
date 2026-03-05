import XLSX from "xlsx"
import { prisma } from "../db/prisma"
import type { JobDTO } from "../dto/jobDto"

export async function loadFavorites(userId: number) {
  return prisma.favorite.findMany({
    where: { userId },
    orderBy: { id: "asc" }
  })
}

export async function saveFavorite(
  userId: number,
  job: JobDTO
) {
  await prisma.favorite.create({
    data: {
      userId,
      jobId: job.id,
      title: job.title,
      company: job.company,
      url: job.url
    }
  })
}

export async function deleteFavorite(
  userId: number,
  jobId: string
) {
  const fav = await prisma.favorite.findFirst({
    where: {
      userId,
      jobId
    }
  })

  if (!fav) return

  await prisma.favorite.delete({
    where: { id: fav.id }
  })
}

export async function exportExcel(userId: number) {
  const list = await loadFavorites(userId)

  const rows = list.map((j) => ({
    Company: j.company,
    URL: j.url
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, ws, "Jobs")

  const buffer = XLSX.write(wb, {
    type: "buffer",
    bookType: "xlsx"
  })

  return buffer
}