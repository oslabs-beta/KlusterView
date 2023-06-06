import express, { Request, Response } from 'express';
import statusController from '../controllers/statusController';

const statusRouter = express.Router();

statusRouter.get(
  '',
  statusController.checkStatus,
  (req: Request, res: Response) => {
    return res.sendStatus(200);
  }
);

statusRouter.post(
  '/setup',
  statusController.runSetup,
  statusController.openPorts,
  (req: Request, res: Response) => {
    return res.sendStatus(200);
  }
);

export default statusRouter;
