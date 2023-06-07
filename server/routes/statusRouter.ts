import express, { Request, Response } from 'express';
import statusController from '../controllers/statusController';
import initializationController from '../controllers/initializationController';

const statusRouter = express.Router();

statusRouter.get(
  '',
  statusController.checkStatus,
  initializationController.initializeGrafana,
  initializationController.login,
  (req: Request, res: Response) => {
    return res.sendStatus(200);
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
