import { Router } from "express"

import {
  loadFavorites,
  saveFavorite,
  deleteFavorite,
  exportExcel
} from "../services/favoritesService"

const router = Router()

router.post("/", async (req, res) => {
  const { userId, job } = req.body

  await saveFavorite(userId, job)

  res.json({ ok: true })
})

router.get("/:userId", async (req, res) => {
  const userId = Number(req.params.userId)

  const list = await loadFavorites(userId)

  res.json(list)
})

router.get("/export/:userId", async (req, res) => {
  const userId = Number(req.params.userId)
  const buffer = await exportExcel(userId)

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=favorites_${userId}.xlsx`
  )

  res.send(buffer)
})

router.delete("/:userId/:jobId", async (req, res) => {
  const userId = Number(req.params.userId)
  const jobId = req.params.jobId

  await deleteFavorite(userId, jobId)

  res.json({ ok: true })
})

export default router