import { Router } from 'express';

import { loadPosition, savePosition } from '../services/positionService';

const router = Router();

router.get('/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  const pos = await loadPosition(userId);

  res.json(pos);
});

router.post('/', async (req, res) => {
  const { userId, page, index, query } = req.body;

  await savePosition(userId, page, index, query);

  res.json({ ok: true });
});

export default router;
