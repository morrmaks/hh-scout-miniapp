import { Router } from 'express';

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
    const { userId, jobId } = req.body;

    await saveFavorite(Number(userId), String(jobId));

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// получить список избранного (с фильтрами и пагинацией)
router.get('/', async (req, res, next) => {
  try {
    const userId = Number(req.query.userId);

    const result = await loadFavorites(userId, req.query);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/ids', async (req, res, next) => {
  try {
    const userId = Number(req.query.userId);

    const ids = await loadFavoriteIds(userId);

    res.json({ ids });
  } catch (err) {
    next(err);
  }
});

// экспорт excel
router.get('/export', async (req, res, next) => {
  try {
    const userId = Number(req.query.userId);

    const buffer = await exportExcel(userId);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader('Content-Disposition', `attachment; filename=favorites_${userId}.xlsx`);

    res.send(buffer);
  } catch (err) {
    next(err);
  }
});

// удалить из избранного
router.delete('/:jobId', async (req, res, next) => {
  try {
    const userId = Number(req.query.userId);
    const jobId = req.params.jobId;

    await deleteFavorite(userId, jobId);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.patch('/:jobId/status', async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const { userId, statusId } = req.body;

    await setFavoriteStatus(Number(userId), jobId, statusId !== null ? Number(statusId) : null);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
