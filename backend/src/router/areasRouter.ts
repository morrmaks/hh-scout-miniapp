import { Router } from 'express';

import { getAreas } from '../services/areasService';

const router = Router();

router.get('/', async (req, res) => {
  const areas = await getAreas();
  res.json(areas);
});

export default router;
