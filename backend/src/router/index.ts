import express from 'express';

import areasRouter from './areas.router';
import favoritesRouter from './favorites.router';
import jobsRouter from './jobs.router';

const router = express.Router();

router.use('/jobs', jobsRouter);
router.use('/favorites', favoritesRouter);
router.use('/areas', areasRouter);

export { router };
