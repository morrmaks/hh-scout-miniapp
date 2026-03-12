import express from 'express';

import areasRouter from './areas.router';
import favoritesRouter from './favorites.router';
import jobsRouter from './jobs.router';
import statusesRouter from './statuses.router';

const router = express.Router();

router.use('/jobs', jobsRouter);
router.use('/favorites', favoritesRouter);
router.use('/areas', areasRouter);
router.use('/statuses', statusesRouter);

export { router };
