import {
  Request,
  Response,
  RequestHandler,
  NextFunction,
  Errback
} from 'express';
import { MethodError } from '../types';
import * as child from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { create } from 'domain';

//Define path to scripts folder from project root as well as path to project root
const SCRIPTS_PATH = '/scripts';
const ROOT_PATH = '../..';

//Define process status indicators for setup methods
let SETUP_COMPLETE: boolean = false;
let PORTS_OPEN: boolean = false;

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
///////////////////////////////
const clusterRunning = (
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

const prometheusAndGrafanaRunning = (
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
    if (image?.search(/^grafana\/g/g)) grafana = true;
    if (image?.search(/^prom\/prom/g)) prom = true;
    if (image?.search(/kube-state-metrics/g)) ksm = true;
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

const portForwardingOperational = (
  res: Response,
  next: NextFunction,
  throwErr = true
): void | boolean => {
  let portForwards: string[];
  try {
    portForwards = child
      .execSync(
        `ps -ef | grep 'kubectl' | grep 'port-forward' | awk '{print $10 "|" $11 "|" $12 "|" $13}'`
      )
      .toString()
      .split('\n');
    //console.log(`Obtained port forwards: ${portForwards}`);
  } catch (err) {
    //console.log('Reached first catch block in PFO');
    if (throwErr) {
      return next(
        createError(
          'portForwardingOperational',
          `Encountered error when querying processes for port forwarding: ${err}`,
          500,
          'Encountered error when querying processes for port forwarding'
        )
      );
    } else {
      return false;
    }
  }

  const servicePortPairs = portForwards.map((el) => {
    const parts = el.split('|');
    return [parts[0], parts[3]];
  });
  //console.log(`Mapped PF parts: ${servicePortPairs}`);

  let prom9999: boolean, graf9000: boolean;
  prom9999 = graf9000 = false;

  for (const [service, port] of servicePortPairs) {
    //console.log(`Service: ${service}, Ports: ${port}`);
    if (service && String(port).length >= 4) {
      if (service.search('prom') && port.slice(0, 4) === '9999') {
        prom9999 = true;
      }
      if (service.search('grafana') && port.slice(0, 4) === '9000') {
        graf9000 = true;
      }
    }
  }

  if (prom9999 && graf9000) return true;
  else {
    if (throwErr) {
      if (!prom9999)
        return next(
          createError(
            'portForwardingOperational',
            'Prometheus service not running on localhost:9999. Please set up port forwarding',
            500
          )
        );
      else if (!graf9000)
        return next(
          createError(
            'portForwardingOperational',
            'Grafana service not running on localhost:9000. Please set up port forwarding',
            500
          )
        );
      else
        return next(
          createError(
            'portForwardingOperational',
            'Encountered unknown error while verifying port forwarding',
            500
          )
        );
    }
    return false;
  }
};

//Define individual setup methods
const runSetup = (next: NextFunction): void => {
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
      if (code) {
        if (code == 0) {
          SETUP_COMPLETE = true;
          return;
        } else {
          return next(
            createError(
              'runSetup',
              `Setup.sh exited with non-zero exit code ${code}`,
              500,
              'Error executing setup script'
            )
          );
        }
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

const openPorts = (next: NextFunction): void => {
  //TODO: Establish output, error channels for process to be detached

  try {
    const openPorts = child.spawn(`./open_ports.sh`, {
      cwd: path.join(__dirname, ROOT_PATH, SCRIPTS_PATH),
      detached: true,
      //TODO: Change next line to use file writers for stdout, err
      stdio: 'ignore'
    });

    // openPorts.stdout.on('data', (data) => {
    //   console.log(data.toString());
    // });

    openPorts.addListener('error', (err) => {
      return next(
        createError(
          'runSetup',
          `Encountered error while executing setup script: ${err}`,
          500,
          'Encountered error while executing setup script.'
        )
      );
    });

    openPorts.addListener('exit', (code, signal) => {
      if (code) {
        if (code != 0) {
          return next(
            createError(
              'openPorts',
              `open_ports.sh exited with non-zero exit code ${code}`,
              500,
              'Error starting port forwarding'
            )
          );
        }
      } else {
        return next(
          createError(
            'runSetup',
            `open_ports.sh exited with signal ${signal}`,
            500,
            'Error starting port forwarding'
          )
        );
      }
    });

    openPorts.unref();
  } catch (error) {
    console.log(error);
  }
  return;
};

//Define methods exported on statusController

statusController.checkStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  clusterRunning(res, next);
  console.log('Cleared clusterRunning check');

  prometheusAndGrafanaRunning(res, next);
  console.log('Cleared prometheusAndGrafanaRunning check');
  SETUP_COMPLETE = true;

  portForwardingOperational(res, next);
  console.log('Cleared portForwardingOperational check');
  PORTS_OPEN = true;

  return next();
};

statusController.runSetup = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  clusterRunning(res, next);
  if (!prometheusAndGrafanaRunning(res, next, false)) {
    try {
      runSetup(next);

      let awaitCounter = 0;
      const awaitSetup = setInterval((): void => {
        if (prometheusAndGrafanaRunning(res, next, false)) {
          clearInterval(awaitSetup);
          return next();
        } else if (awaitCounter > 60) {
          clearInterval(awaitSetup);
          return next(
            createError(
              'runSetup',
              'Timed out while awaiting startup completion (30 seconds). Please try again.',
              500
            )
          );
        }
        awaitCounter += 1;
      }, 500);
    } catch (err) {
      return next(
        createError(
          'runSetup',
          `Encountered error while awaiting execution of startup script: ${err}`,
          500,
          'Encountered error while awaiting execution of startup routine'
        )
      );
    }
  }

  return next();
};

statusController.openPorts = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!portForwardingOperational(res, next, false)) {
    try {
      openPorts(next);
      const awaitOpenPortsCounter = 0;
      const awaitOpenPorts = setInterval((): void => {
        if (portForwardingOperational(res, next, false)) {
          PORTS_OPEN = true;
          clearInterval(awaitOpenPorts);
          return next();
        } else if (awaitOpenPortsCounter > 15) {
          clearInterval(awaitOpenPorts);
          return next(
            createError(
              'openPorts',
              `Time out while awaiting port forwarding confirmation`,
              500,
              'Timed out while awaiting confirmation of port forwarding. Please try again.'
            )
          );
        }
      });
    } catch (err) {
      return next(
        createError(
          'openPorts',
          `Encountered error while awaiting confirmation of port forwarding: ${err}`,
          500,
          'Encountered error while awaiting confirmation of port forwarding. Please try again.'
        )
      );
    }
  }
  return next();
};

export default statusController;
