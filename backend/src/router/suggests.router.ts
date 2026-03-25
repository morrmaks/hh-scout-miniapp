import express from 'express';
import { getSuggestKeywords } from '../integrations/hh/hh.service';

const router = express.Router();

router.get('/keywords', async (req, res) => {
  const text = String(req.query.text ?? '');
  if (!text.trim()) return res.json({ items: [] });

  const data = await getSuggestKeywords(text);
  res.json(data);
});

export default router;
