import { NextFunction, Request, Response } from 'express';

export const roleCheck = (...roles: string[]) => {
  const fn = (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error('Недостаточно прав'));
    }

    next();
  };

  return fn;
};
