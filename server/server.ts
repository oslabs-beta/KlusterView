import { Errback, NextFunction, Request, Response, Router } from 'express';
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import promRouter from './routes/promRouter';
import grafanaRouter from './routes/grafanaRouter';
import statusRouter from './routes/statusRouter';
import { MethodError } from './types';
import { IncomingMessage } from 'http';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
dotenv.config();

//DEFINE KEY CONSTANTS HERE for use throughout app

const PORT = 3000;

const GRAF_HOST = 'grafana'
const GRAF_PORT = 3000;

const PROM_HOST = 'prometheus-service.monitoring-kv.svc.cluster.local'
const PROM_PORT = 8080;

//environment variables
// const { MONGO_URI, SERVER_PORT } = process.env;

// if (!MONGO_URI) {
//   //type guarding
//   throw new Error('MONGO_URI environment variable is not set');
// }
// //databse connection
// mongoose
//   .connect(MONGO_URI)
//   .then(() => console.log('Database connection started'))
//   .catch((err) => console.log(err));

//serving up html file
app.get('/', (req: Request, res: Response) => {
  return res
    .status(200)
    .sendFile(path.resolve(__dirname, '../client/index.html'));
});

//Prom router gets data from PromAPI
app.use('/prom', promRouter);

//Grafana router gets visualization items from Grafana Dashboard
app.use('/grafana', grafanaRouter);

//Status router checks Kubernetes status and takes action as appropriate
app.use('/status', statusRouter);

//Forward calls to Grafana to internal path
app.use('/grafanasvc', createProxyMiddleware({target: `http://${GRAF_HOST}:${GRAF_PORT}`, changeOrigin: false, auth:'admin:admin', ws: true, onError: (err: Error, req: Request, res: Response) => {
  console.log(err);
  console.log(res);
  res.status(500);
  res.send(err);
}}))

//Forward calls to Prom to internal path
app.use('/promsvc', createProxyMiddleware({target: `http://${PROM_HOST}:${PROM_PORT}`, changeOrigin: false, ws: true }))


//404 Handler
app.use('*', (req: Request, res: Response) => {
  console.log('run');
  return res.status(404).json('Not found');
});

//global error handler
app.use(
  (
    err: Errback | MethodError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 400,
      message: { err: 'An unknown error occurred' }
    };
    const errorObj = Object.assign(defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  }
);

//app starts on port 3000
app.listen(3000, () => {
  console.log(`Server started to listen on port 3000`);
});
