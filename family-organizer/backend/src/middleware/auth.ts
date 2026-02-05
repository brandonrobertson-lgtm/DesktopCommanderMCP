import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement JWT authentication
  // For now, just pass through
  next();
};
