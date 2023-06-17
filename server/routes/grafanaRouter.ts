import express, { Request, Response } from 'express';
import grafanaController from '../controllers/grafanaController';
const grafanaRouter = express.Router();

//this route gets the pods dashbaord url
grafanaRouter.get(
  '/pods',
  grafanaController.getPods,
  (req: Request, res: Response) => {
    if (res.locals.src) {
      return res.status(200).json(res.locals.src);
    } else {
      return res.status(404).json('Dashboard source can not be found');
    }
  }
);
// this route get cluster/main dashboard url
grafanaRouter.get(
  '/dashboard',
  grafanaController.getCluster,
  (req: Request, res: Response) => {
    if (res.locals.src) {
      return res.status(200).json(res.locals.src);
    } else {
      return res.status(404).json('Dashboard source can not be found');
    }
  }
);

export default grafanaRouter;
