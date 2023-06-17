import express, { Request, Response } from 'express';
import initializationController from '../controllers/initializationController';

const statusRouter = express.Router();

statusRouter.get(
  '/init',
  initializationController.initializeGrafana,
  initializationController.login,
  (req: Request, res: Response) => {
    return res
      .status(200)
      .json([res.locals.login, res.locals.maindash, res.locals.poddash]);
  }
);

export default statusRouter;
