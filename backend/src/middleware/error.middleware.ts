import type { NextFunction, Request, Response } from 'express';

export function errorMiddleware(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error('API ERROR:', err);

  const status = err.status || 500;

  res.status(status).json({
    error: true,
    message: err.message || 'Internal server error',
    details: err.hh || null
  });
}
