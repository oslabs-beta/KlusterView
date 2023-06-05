import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
  Errback
} from 'express';
import { MethodError } from '../types';
import * as child from 'child_process';
import cluster from 'cluster';

//Define StatusController type and initialize empty controller
type StatusController = { [s: string]: RequestHandler };

const statusController: StatusController = {};

//Define module-level error generator
const createError = (
  method: String,
  log: String,
  status: Number,
  message: String = log
): MethodError => {
  return {
    log: `Encountered error in statusController.${method}: ${log}`,
    status: status,
    message: { err: message }
  };
};

//Define individual status check methods
const clusterRunning = (res: Response): Boolean => {
  try {
    const clusterInfo = child.execSync(`kubectl cluster-info`).toString();
    return true;
  } catch (err) {
    //console.log(err);
    //console.log('Reached error condition in clusterRunning');

    //TODO: Replace with call to next with appropriate error
    return false;
  }
};

const prometheusAndGrafanaRunning = (res: Response): Boolean => {
  let runningImages: string[];
  try {
    runningImages = child
      .execSync(
        `kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\\
        tr -s '[[:space:]]' '\\n' |\\
        sort |\\
        uniq`
      )
      .toString()
      .split('\n');
  } catch (err) {
    //TODO: Replace with call to next with appropriate error
    return false;
  }

  let prom, grafana, ksm;
  prom = grafana = ksm = false;

  while (!(prom && grafana && ksm) && runningImages.length) {
    const image = runningImages.pop();
    if (image?.search(/^grafana\/g/g)) grafana = true;
    if (image?.search(/^prom\/prom/g)) prom = true;
    if (image?.search(/kube-state-metrics/g)) ksm = true;
  }

  if (ksm && grafana && prom) return true;
  //TODO: Replace with call to next with appropriate error
  return false;
};

const portForwardingOperational = (res: Response): boolean => {
  let portForwards: string[] | string[][];
  try {
    portForwards = child
      .execSync(
        `ps -ef | grep 'kubectl' | grep 'port-forward' | awk '{print $10 "|" $11 "|" $12 "|" $13}'`
      )
      .toString()
      .split('\n');
    console.log('Completed system call');
  } catch (Err) {
    console.log('Errored out');
    return false;
  }

  const servicePortPairs = portForwards.map((el) => {
    console.log(el);
    const parts = el.split('|');
    return [parts[0], parts[3]];
  });

  console.log(servicePortPairs);
  res.locals.testResp = servicePortPairs;
  return true;
};

statusController.checkStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!clusterRunning(res)) {
    res.locals.status = 'failed';
    console.log('No cluster found');
    return next();
  }
  if (!prometheusAndGrafanaRunning(res)) {
    res.locals.status = 'failed';
    console.log('Services not running');
    return next();
  }
  portForwardingOperational(res);
  return next();
};

statusController.runSetup = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  return next();
};

statusController.openPorts = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  return next();
};

export default statusController;
