import { Router } from 'express';

import { createResume, deleteResume, loadResumes, updateResume } from '../services/resumes.service';

const router = Router();

// получить список резюме
router.get('/', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;

    const resumes = await loadResumes(Number(userId));

    res.json(resumes);
  } catch (err) {
    next(err);
  }
});

// создать резюме
router.post('/', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;

    const { name } = req.body;

    const resume = await createResume(Number(userId), String(name));

    res.json(resume);
  } catch (err) {
    next(err);
  }
});

// редактировать резюме
router.patch('/:id', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;
    const id = Number(req.params.id);

    const { name } = req.body;

    const resume = await updateResume(Number(userId), id, name);

    res.json(resume);
  } catch (err) {
    next(err);
  }
});

// удалить резюме
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.telegramUser!.id;

    const id = Number(req.params.id);

    await deleteResume(Number(userId), id);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
