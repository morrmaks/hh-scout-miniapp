import { Router } from 'express';

import {
  deleteFavorite,
  exportExcel,
  loadFavorites,
  saveFavorite
} from '../services/favoritesService';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { userId, job } = req.body;

    await saveFavorite(userId, job);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get('/export/:userId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
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

router.get('/:userId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    const list = await loadFavorites(userId);

    res.json(list);
  } catch (err) {
    next(err);
  }
});

router.delete('/:userId/:jobId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const jobId = req.params.jobId;

    await deleteFavorite(userId, jobId);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
