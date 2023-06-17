import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
  Errback
} from 'express';
import { MethodError } from '../types';
import * as path from 'path';
import * as fs from 'fs';

import b64 from 'base-64';
const encode = b64.encode;

const GRAF_IP = 'grafana.monitoring-kv.svc.cluster.local';
const GRAF_NODE_PORT = '3000';

//Define module-level error generator
const createError = (
  method: String,
  log: String,
  status: Number,
  message: String = log
): MethodError => {
  return {
    log: `Encountered error in initializationController.${method}: ${log}`,
    status: status,
    message: { err: message }
  };
};

//Define and initialize init controller
type InitializationController = { [k: string]: RequestHandler };
const initializationController: InitializationController = {};

//Logs in as admin at start of session
initializationController.login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const response = await fetch(`http://${GRAF_IP}:${GRAF_NODE_PORT}/login`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encode(`admin:admin`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: 'admin',
        password: 'admin'
      })
    });

    res.locals.login = await response.json();

    if (!response.ok) {
      const resp = await response.json();
      console.log(resp);
      return next(
        createError(
          'login',
          `Encountered error while logging into Grafana. Response other than OK: ${resp}`,
          500
        )
      );
    }

    console.log('User signed in successfully');
    return next();
  } catch (error) {
    return next(
      createError(
        'login',
        `Received error while attempting to sign in: ${error}`,
        500
      )
    );
  }
};

//Loads main and pod dashboards upon first deployment
initializationController.initializeGrafana = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  //Fetch data for main, pod dashboards
  const mainDashboardData = fs
    .readFileSync(
      path.resolve(
        __dirname,
        '../../deployment/_dashboards/Aggregate_Metrics.json'
      )
    )
    .toString();
  const podsDashboardData = fs
    .readFileSync(
      path.resolve(
        __dirname,
        '../../deployment/_dashboards/pod_level_metrics.json'
      )
    )
    .toString();
  //Upload aggregate metrics dashboard
  try {
    console.log(encode('admin:admin'));
    const mainResp = await fetch(
      `http://${GRAF_IP}:${GRAF_NODE_PORT}/api/dashboards/db`,
      {
        method: 'POST',
        body: JSON.stringify({ dashboard: JSON.parse(mainDashboardData) }),
        headers: {
          Authorization: `Basic ${encode(`admin:admin`)}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.locals.maindash = await mainResp.json();

    if (!mainResp.ok) {
      if (mainResp.status !== 412) {
        const resp = await mainResp.json();
        console.log(resp);
        return next(
          createError(
            'initializeGrafana',
            `Encountered error while initializing main dashboard. Response other than OK: ${mainResp}`,
            500
          )
        );
      }
    }
  } catch (err) {
    return next(
      createError(
        'initializeGrafana',
        `Encountered error while initializing main dashboard: ${err}`,
        500
      )
    );
  }

  //Upload pod metrics dashboard
  try {
    const podResp = await fetch(
      `http://${GRAF_IP}:${GRAF_NODE_PORT}/api/dashboards/db`,
      {
        method: 'POST',
        body: JSON.stringify({ dashboard: JSON.parse(podsDashboardData) }),
        headers: {
          Authorization: `Basic ${encode(`admin:admin`)}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.locals.poddash = await podResp.json();
    if (!podResp.ok) {
      if (podResp.status !== 412) {
        const resp = await podResp.json();
        console.log(resp);
        return next(
          createError(
            'initializeGrafana',
            'Encountered error while initializing pods dashboard',
            500
          )
        );
      }
    }
  } catch (err) {
    return next(
      createError(
        'initializeGrafana',
        `Encountered error while initializing pods dashboard: ${err}`,
        500
      )
    );
  }

  return next();
};

export default initializationController;
