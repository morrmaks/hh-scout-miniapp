import express from 'express';

import { telegramAuthMiddleware } from '../middleware/telegramAuth.middleware';
import areasRouter from './areas.router';
import favoritesRouter from './favorites.router';
import jobsRouter from './jobs.router';
import resumesRouter from './resumes.router';
import statusesRouter from './statuses.router';

const router = express.Router();

router.use('/jobs', jobsRouter);
router.use('/favorites', telegramAuthMiddleware, favoritesRouter);
router.use('/resumes', telegramAuthMiddleware, resumesRouter);
router.use('/areas', areasRouter);
router.use('/statuses', telegramAuthMiddleware, statusesRouter);

export { router };
