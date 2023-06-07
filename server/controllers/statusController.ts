import { Request, Response, RequestHandler, NextFunction } from 'express';
import { MethodError } from '../types';
import {
  clusterRunning,
  prometheusAndGrafanaRunning,
  runSetup
} from './helpers/statusHelpers';

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

//Define methods exported on statusController

statusController.checkStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  clusterRunning(res, next);
  console.log('Cleared clusterRunning check');

  prometheusAndGrafanaRunning(res, next);
  console.log('Cleared prometheusAndGrafanaRunning check');

  return next();
};

statusController.runSetup = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  clusterRunning(res, next);
  if (!prometheusAndGrafanaRunning(res, next, false)) {
    try {
      runSetup(next);
      let awaitCounter = 0;
      const awaitSetup = setInterval((): void => {
        if (prometheusAndGrafanaRunning(res, next, false)) {
          clearInterval(awaitSetup);
          return next();
        } else if (awaitCounter > 60) {
          clearInterval(awaitSetup);
          return next(
            createError(
              'runSetup',
              'Timed out while awaiting startup completion (30 seconds). Please try again.',
              500
            )
          );
        }
        awaitCounter += 1;
      }, 500);
    } catch (err) {
      return next(
        createError(
          'runSetup',
          `Encountered error while awaiting execution of startup script: ${err}`,
          500,
          'Encountered error while awaiting execution of startup routine'
        )
      );
    }
  } else {
    return next();
  }
};

export default statusController;
