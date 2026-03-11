import { Router } from 'express';

import { getJobById, getJobs, getPrefetchjobs } from '../services/jobs.service';
import { parseJobFilters } from '../utils/parseJobFilters';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await getJobs(parseJobFilters(req.query));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/prefetch', async (req, res, next) => {
  try {
    const filters = parseJobFilters(req.query);
    const result = await getPrefetchjobs(filters);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const job = await getJobById(req.params.id);
    res.json(job);
  } catch (err) {
    next(err);
  }
});

export default router;
