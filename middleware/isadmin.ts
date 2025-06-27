import { Request, Response, NextFunction } from 'express';

export const isadmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user; // ✅ lowercase 'user', not 'User'

  if (user?.email !== 'admin@gmail.com') { 
    return res.status(403).json({ message: "Forbidden: Admin access only" });
  }

  next();
};
