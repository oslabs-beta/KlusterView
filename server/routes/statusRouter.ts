import express, { Request, Response } from 'express';
import statusController from '../controllers/statusController';
import initializationController from '../controllers/initializationController';

const statusRouter = express.Router();

statusRouter.get(
  '',
  statusController.checkStatus,
  (req: Request, res: Response) => {
    return res.sendStatus(200);
  }
);

statusRouter.get(
  '/init',
  statusController.checkStatus,
  initializationController.initializeGrafana,
  initializationController.login,
  (req: Request, res: Response) => {
    return res.status(200).json([res.locals.login, res.locals.maindash, res.locals.poddash]);
  }
);

statusRouter.post(
  '/setup',
  statusController.runSetup,
  (req: Request, res: Response) => {
    return res.sendStatus(200);
  }
);

export default statusRouter;
