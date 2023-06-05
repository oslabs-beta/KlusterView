import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
  Errback
} from 'express';
import { MethodError } from '../types';
import * as child from 'child_process';

//Define StatusController type and initialize empty controller
type StatusController = { [s: string]: RequestHandler };

const statusController: StatusController = {};

//Define module-level error generator
const createError = (
  method: String,
  log: String,
  status: Number,
  message: String = log
): MethodError => {
  return {
    log: `Encountered error in statusController.${method}: ${log}`,
    status: status,
    message: { err: message }
  };
};

statusController.checkStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  return next();
};

statusController.runSetup = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  return next();
};

statusController.openPorts = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  return next();
};

export default statusController;
