import { Request, Response, NextFunction } from 'express';
export interface MiddlewareFn {
  (req: Request, res: Response, next: NextFunction): void;
}
