import { Router } from 'express';

import { getVacancyById, prefetchVacancies, searchJobs } from '../services/jobsService';

const router = Router();

router.get('/', async (req, res) => {
  const q = String(req.query.q || '');
  const page = Number(req.query.page || 1);

  const result = await searchJobs(q, page);

  res.json(result);
});

router.get('/prefetch', async (req, res) => {
  const q = String(req.query.q || '');
  const page = Number(req.query.page || 1);
  const index = Number(req.query.index || 0);

  await prefetchVacancies(q, page, index);

  res.json({ ok: true });
});

router.get('/:id', async (req, res) => {
  const job = await getVacancyById(req.params.id);
  res.json(job);
});

export default router;
