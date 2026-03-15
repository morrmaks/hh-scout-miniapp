import { Router } from 'express';

import {
  createStatus,
  deleteStatus,
  getStatuses,
  updateStatus
} from '../services/statuses.service';

const router = Router();

// список статусов пользователя
router.get('/', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;

    const statuses = await getStatuses(userId);

    res.json(statuses);
  } catch (err) {
    next(err);
  }
});

// создать статус
router.post('/', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;
    const { name, color } = req.body;

    const status = await createStatus(userId, name, color);

    res.json(status);
  } catch (err) {
    next(err);
  }
});

// изменить статус
router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, color } = req.body;

    const status = await updateStatus(id, name, color);

    res.json(status);
  } catch (err) {
    next(err);
  }
});

// удалить статус
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    await deleteStatus(id);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
