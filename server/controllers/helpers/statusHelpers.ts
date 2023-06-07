import { Response, NextFunction } from 'express';
import { MethodError } from '../../types';
import * as child from 'child_process';
import * as path from 'path';

//Define path to scripts folder from project root as well as path to project root
const SCRIPTS_PATH = '/scripts';
const ROOT_PATH = '../../..';

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
///////////////////////////////
export const clusterRunning = (
  res: Response,
  next: NextFunction,
  throwErr: boolean = true
): void | boolean => {
  try {
    const clusterInfo = child.execSync(`kubectl cluster-info`).toString();
    return true;
  } catch (err) {
    if (throwErr) {
      return next(
        createError(
          'clusterRunning',
          `No running cluster found when calling kubectl cluster-info: Encountered error ${err}`,
          500,
          'No running cluster found when calling kubectl cluster-info. Please ensure cluster to be monitored is operational and accessible.'
        )
      );
    } else {
      return false;
    }
  }
};

export const prometheusAndGrafanaRunning = (
  res: Response,
  next: NextFunction,
  throwErr: boolean = true
): void | boolean => {
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
    if (throwErr) {
      return next(
        createError(
          'prometheusAndGrafanaRunning',
          `Encountered error when querying kubectl for running container images: ${err}`,
          500,
          'Encountered error when querying kubectl for running container images'
        )
      );
    } else {
      return false;
    }
  }

  let prom: Boolean, grafana: Boolean, ksm: Boolean;
  prom = grafana = ksm = false;

  while (!(prom && grafana && ksm) && runningImages.length) {
    const image = runningImages.pop();
    //console.log(image);
    if (image?.search(/^grafana\/g/g) !== -1) grafana = true;
    if (image?.search(/^prom\/prom/g) !== -1) prom = true;
    if (image?.search(/kube-state-metrics/g) !== -1) ksm = true;
    //console.log(`Prom: ${prom}, Grafana: ${grafana}, KSM: ${ksm}`);
  }

  if (ksm && grafana && prom) return true;
  else {
    if (throwErr) {
      if (!ksm)
        return next(
          createError(
            'prometheusAndGrafanaRunning',
            'Kube State Metrics not detected among running containers. Please verify.',
            500
          )
        );
      else if (!prom)
        return next(
          createError(
            'prometheusAndGrafanaRunning',
            'Prometheus not detected among running containers. Please verify.',
            500
          )
        );
      else if (!grafana)
        return next(
          createError(
            'prometheusAndGrafanaRunning',
            'Grafana not detected among running containers. Please verify.',
            500
          )
        );
      return next(
        createError('prometheusAndGrafanaRunning', 'Unknown error', 500)
      );
    }
  }
  return false;
};

//Define individual setup methods
export const runSetup = (next: NextFunction): void => {
  try {
    const setup = child.spawn(`./setup.sh`, {
      cwd: path.join(__dirname, ROOT_PATH, SCRIPTS_PATH)
    });

    setup.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    setup.addListener('error', (err) => {
      return next(
        createError(
          'runSetup',
          `Encountered error while executing setup script: ${err}`,
          500,
          'Encountered error while executing setup script.'
        )
      );
    });

    setup.addListener('exit', (code, signal) => {
      if (code === 0) {
        return;
      } else if (code) {
        return next(
          createError(
            'runSetup',
            `Setup.sh exited with non-zero exit code ${code}`,
            500,
            'Error executing setup script'
          )
        );
      } else {
        return next(
          createError(
            'runSetup',
            `Setup.sh exited with signal ${signal}`,
            500,
            'Error executing setup script'
          )
        );
      }
    });

    //console.log(paths);
  } catch (error) {
    console.log(error);
  }
  return;
};
