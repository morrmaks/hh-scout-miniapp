import { Router } from 'express';

import { bot } from '../integrations/telegram';
import {
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
    const { jobId } = req.body;

    await saveFavorite(Number(userId), String(jobId));

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// получить список избранного (с фильтрами и пагинацией)
router.get('/', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;

    const result = await loadFavorites(userId, req.query);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/ids', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;

    const ids = await loadFavoriteIds(userId);

    res.json({ ids });
  } catch (err) {
    next(err);
  }
});

// экспорт excel

router.get('/export', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;

    const buffer = await exportExcel(userId);

    await bot.sendDocument(
      userId,
      buffer,
      {
        caption: 'Ваши избранные вакансии'
      },
      {
        filename: `favorites_${userId}.xlsx`,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// удалить из избранного
router.delete('/:jobId', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;
    const jobId = req.params.jobId;

    await deleteFavorite(userId, jobId);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

router.patch('/:jobId/status', async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.telegramUser!.id;
    const { statusId } = req.body;

    await setFavoriteStatus(Number(userId), jobId, statusId !== null ? Number(statusId) : null);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
