import { Router } from 'express';

import { bot } from '../integrations/telegram';
import {
  clearFavoritesByResumes,
  deleteFavorite,
  exportExcel,
  loadFavoriteIds,
  loadFavorites,
  saveFavorite,
  setFavoriteStatus
} from '../services/favorites.service';

const router = Router();

// добавить в избранное
router.post('/', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;

    const { jobId, resumeIds } = req.body;

    await saveFavorite(Number(userId), String(jobId), resumeIds.map(Number));

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// получить список избранного
router.get('/', async (req, res, next) => {
  try {
    const userId = Number(req.telegramUser!.id);

    const resumeId = Number(req.query.resumeId);

    const result = await loadFavorites(userId, resumeId, req.query);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// получить ids избранных вакансий
router.get('/ids', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;

    const ids = await loadFavoriteIds(Number(userId));

    res.json({ ids });
  } catch (err) {
    next(err);
  }
});

router.delete('/clear', async (req, res, next) => {
  try {
    const userId = Number(req.telegramUser!.id);

    const resumeIdsRaw = req.query.resumeIds;

    const resumeIds = Array.isArray(resumeIdsRaw)
      ? resumeIdsRaw.map(Number)
      : [Number(resumeIdsRaw)];

    await clearFavoritesByResumes(userId, resumeIds);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// экспорт excel
router.get('/export', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;

    const resumeId = Number(req.query.resumeId);

    const buffer = await exportExcel(Number(userId), resumeId);

    await bot.sendDocument(
      userId,
      buffer,
      { caption: 'Ваши избранные вакансии' },
      {
        filename: `favorites_${resumeId}.xlsx`,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// удалить из избранного для резюме
router.delete('/:jobId', async (req, res, next) => {
  try {
    const userId = Number(req.telegramUser!.id);
    const jobId = req.params.jobId;
    const resumeIdsRaw = req.query.resumeIds;

    const resumeIds = Array.isArray(resumeIdsRaw)
      ? resumeIdsRaw.map(Number)
      : [Number(resumeIdsRaw)];

    await deleteFavorite(userId, jobId, resumeIds);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// изменить статус
router.patch('/:jobId/status', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;

    const jobId = req.params.jobId;

    const { resumeId, statusId } = req.body;

    await setFavoriteStatus(
      Number(userId),
      jobId,
      Number(resumeId),
      statusId !== null ? Number(statusId) : null
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
