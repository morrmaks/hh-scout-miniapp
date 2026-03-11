import { Router } from 'express';

import { getAreas } from '../services/areas.service';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const areas = await getAreas();
    res.json(areas);
  } catch (err) {
    next(err);
  }
});

export default router;
