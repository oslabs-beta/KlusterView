import express, { Request, Response } from 'express';
import promController from '../controllers/promController';

const promRouter = express.Router();

promRouter.get(
  '/pods/',
  promController.getPodNames,
  promController.getpodIP,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals);
  }
);

export default promRouter;
