import type { NextFunction, Request, Response } from 'express';

import { parse, validate } from '@telegram-apps/init-data-node';
import process from 'node:process';

import 'dotenv/config';
import { env } from '@/config/env';

const BOT_TOKEN = env.BOT_TOKEN;

export function telegramAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const initData = req.headers['x-telegram-init-data'];

    if (!initData || typeof initData !== 'string') {
      return res.status(401).json({ error: 'Missing Telegram initData' });
    }

    validate(initData, BOT_TOKEN);

    const data = parse(initData);

    if (!data.user) {
      return res.status(401).json({ error: 'Telegram user not found' });
    }

    req.telegramUser = {
      ...data.user,
      id: String(data.user.id)
    };

    next();
  } catch {
    return res.status(401).json({ error: 'Invalid Telegram initData' });
  }
}
