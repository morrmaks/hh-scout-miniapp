import type { Request, Response } from 'express';

export const errorMiddleware = (err: Error, req: Request, res: Response) => {
  console.log(err);
  res.status(500).json({ message: 'Непредвиденная ошибка' });
};
