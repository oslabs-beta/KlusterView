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
export interface statusNames {
  podName: string;
  podStatus: string;
}
export interface stausObject {
  metric: {
    [keys: string]: string;
  };
  value: string | number[];
}
export interface PodMetric {
  metric: {
    pod: string;
    pod_ip: string;
  };
}

export interface podObject {
  metric: { [key: string]: string };
  value: number | string[];
}
