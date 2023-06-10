import express, { Request, Response } from 'express';
import promController from '../controllers/promController';

const promRouter = express.Router();

promRouter.get(
  '/pods/',
  promController.getPodNames,
  // promController.getpodIP,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.names);
  }
);

promRouter.get(
  '/pod/status',
  promController.getPodStatuses,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.podStatusNames);
  }
);
promRouter.get(
  '/pods/nodes',
  promController.getPodNodes,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.podNodes);
  }
);

export default promRouter;
