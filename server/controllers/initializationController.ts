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
import { encode } from 'base-64';
import * as child from 'child_process';

//Get NodeIPs for grafana

export const getNodeIPs = (): string[] => {
  let IPs: string[];
  try {
    const addresses: string[] = child
      .execSync('kubectl get nodes -o jsonpath="{.items[*].status.addresses}"')
      .toString()
      .split(/\s/gi);

    const addressObj: { address: string; type: string }[] = addresses
      .map((el) => JSON.parse(el))
      .flat();

    IPs = addressObj
      .filter((el) => el.type.search('IP') !== -1)
      .map((el) => el.address);
  } catch {
    IPs = ['localhost'];
  }

  return IPs;
};

//const IPList = getNodeIPs();
const GRAF_IP = 'grafana.monitoring-kv.svc.cluster.local'//IPList[0];
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

type InitializationController = { [k: string]: RequestHandler };
const initializationController: InitializationController = {};

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

initializationController.initializeGrafana = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const mainDashboardData = fs
    .readFileSync(
      path.resolve(
        __dirname,
        '../../deployment/_dashboards/Aggregate_Metrics.json'
      )
    )
    .toString();
  //console.dir(JSON.parse(mainDashboardData));
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
