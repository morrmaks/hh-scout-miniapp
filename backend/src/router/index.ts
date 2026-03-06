import express from 'express';

import areasRouter from './areasRouter';
import favoritesRouter from './favoritesRouter';
import jobsRouter from './jobsRouter';

const router = express.Router();

router.use('/jobs', jobsRouter);
router.use('/favorites', favoritesRouter);
router.use('/areas', areasRouter);

export { router };
