import { Router } from 'express';

import { getVacancyById, prefetchVacancies, searchJobs } from '../services/jobsService';

const router = Router();

router.get('/', async (req, res) => {
  const q = String(req.query.q || '');
  const page = Number(req.query.page || 0);

  const result = await searchJobs(q, page);

  res.json(result);
});

router.post('/prefetch', async (req, res) => {
  const ids = req.body.ids as string[];

  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids required' });

  await prefetchVacancies(ids);

  res.json({ ok: true });
});

router.get('/:id', async (req, res) => {
  const job = await getVacancyById(req.params.id);

  res.json(job);
});

export default router;
