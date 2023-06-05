import { Request, Response, NextFunction } from 'express';

export type MiddlewareFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type MethodError = {
  log: String;
  status: Number;
  message: { err: String };
};
