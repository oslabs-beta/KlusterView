import express, { Request, Response } from 'express';
import promController from '../controllers/promController';

const promRouter = express.Router();

//this router gets names of all the pods
promRouter.get(
  '/pods/',
  promController.getPodNames,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.names);
  }
);
//this router gets status of all the pods with their name
promRouter.get(
  '/pod/status',
  promController.getPodStatuses,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.podStatusNames);
  }
);
//this router gets more pod level data and, nodes with their corresponding pods
promRouter.get(
  '/pods/nodes',
  promController.getPodNodes,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.result);
  }
);

export default promRouter;
