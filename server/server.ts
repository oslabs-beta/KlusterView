import { Errback, NextFunction, Request, Response, Router } from 'express';
import {
  createProxyMiddleware,
  Filter,
  Options,
  RequestHandler
} from 'http-proxy-middleware';
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
import exp from 'constants';
import b64 from 'base-64';
const encode = b64.encode;

const app = express();

dotenv.config();

//DEFINE KEY CONSTANTS HERE for use throughout app

let staticPath: string;
let mainPath: string;

const PORT = 3000;

const GRAF_HOST = 'grafana';
const GRAF_PORT = 3000;

const PROM_HOST = 'prometheus-service.monitoring-kv.svc.cluster.local';
const PROM_PORT = 8080;

const grafProxy = createProxyMiddleware({
  target: `http://${GRAF_HOST}:${GRAF_PORT}`,
  changeOrigin: true,
  auth: 'admin:admin',
  timeout: 30000,
  onProxyReq: function (proxyReq, req, res) {
    proxyReq.shouldKeepAlive = true;
    console.log(proxyReq.headersSent);
    console.log(req.path);
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['access-control-allow-credentials'] = 'true';
    proxyRes.headers['access-control-allow-methods'] =
      'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['access-control-allow-headers'] =
      'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Requested-With';
  },
  onError: (err: Error, req: Request, res: Response) => {
    console.log(err);
    console.log(res);
    res.status(500);
    res.send(err);
  }
});

app.use('/grafanasvc', grafProxy);
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
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

if (process.env.NODE_ENV === 'production') {
  staticPath = '../dist';
  mainPath = '../dist/index.html';
} else if (process.env.NODE_ENV === 'development') {
  staticPath = '../client';
  mainPath = '../client/index.html';
}

app.get('/', (req: Request, res: Response) => {
  return res.status(200).sendFile(path.resolve(__dirname, mainPath));
});

app.use(express.static(path.resolve(__dirname, staticPath)));

//Prom router gets data from PromAPI
app.use('/prom', promRouter);

//Grafana router gets visualization items from Grafana Dashboard
app.use('/grafana', grafanaRouter);

//Status router checks Kubernetes status and takes action as appropriate
app.use('/status', statusRouter);

//Forward calls to Grafana to internal path
// app.use('grafanasvc/api/live', createProxyMiddleware({target: `http://${GRAF_HOST}:${GRAF_PORT}/api/live`,
// changeOrigin: true,
// auth: 'admin:admin',
// timeout: 30000,}))

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
const server = app.listen(3000, () => {
  console.log(`Server started to listen on port 3000`);
});
server.on('upgrade', grafProxy.upgrade);
server.keepAliveTimeout = 30000;
server.headersTimeout = 31000;
