import { Router } from 'express';

import { getVacancyById, prefetchVacancies, searchJobs } from '../services/jobsService';
import { parseJobFilters } from '../utils/parseJobFilters';

const router = Router();

router.get('/', async (req, res) => {
  const result = await searchJobs(parseJobFilters(req.query));
  res.json(result);
});

router.get('/prefetch', async (req, res) => {
  const filters = parseJobFilters(req.query);

  const result = await prefetchVacancies({
    ...filters,
    index: Number(req.query.index || 0)
  });

  res.json(result);
});

router.get('/:id', async (req, res) => {
  const job = await getVacancyById(req.params.id);

  res.json(job);
});

export default router;
