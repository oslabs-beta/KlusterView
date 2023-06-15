import { MiddlewareFn, PodMetric, stausObject, podObject } from '../types';
import axios from 'axios';

const PROM_IP = 'prometheus-service.monitoring-kv.svc.cluster.local';
const PROM_NODE_PORT = '8080';

const getPodNames: MiddlewareFn = async (req, res, next) => {
  try {
    console.log('Trying to retrieve pod names');

    const response = await axios.get(
      `http://${PROM_IP}:${PROM_NODE_PORT}/api/v1/query?query=kube_pod_info`
    );

    const podMetrics = response.data.data.result as PodMetric[];
    const podNames: { name: string; ip: string }[] = podMetrics.map((item) => {
      return { name: item.metric.pod, ip: item.metric.pod_ip };
    });

    res.locals.names = podNames;
    return next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getpodIP: MiddlewareFn = async (req, res, next) => {
  try {
    console.log('trying to retrieve ip');

    const response = await axios.get(
      `http://${PROM_IP}:${PROM_NODE_PORT}/api/v1/query?query=kube_pod_info`
    );

    const podMetrics = response.data.data.result as PodMetric[];
    const podIPs: string[] = podMetrics.map((item) => item.metric.pod_ip);

    res.locals.podIPs = podIPs;
    return next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getPodStatuses: MiddlewareFn = async (req, res, next) => {
  try {
    const response = await axios.get(
      `http://${PROM_IP}:${PROM_NODE_PORT}/api/v1/query?query=kube_pod_status_phase`
    );
    const podStatusInfo = response.data.data.result;

    const podStatusNames = {};

    podStatusInfo.forEach((el: stausObject) => {
      if (el.value[1] === '1') {
        if (!podStatusNames[el.metric.pod]) {
          podStatusNames[el.metric.pod] = el.metric.phase;
        }
      }
    });

    res.locals.podStatusNames = podStatusNames;
    return next();
  } catch (error) {}
};

const getPodNodes: MiddlewareFn = async (req, res, next) => {
  try {
    const response = await axios.get(
      `http://${PROM_IP}:${PROM_NODE_PORT}/api/v1/query?query=kube_pod_info`
    );
    const pods = response.data.data.result;
    const podNodes = pods.reduce(
      (acc: { [key: string]: string[] }, curr: podObject) => {
        if (acc[curr.metric.node]) {
          acc[curr.metric.node].push(curr.metric.pod);
        } else {
          acc[curr.metric.node] = [curr.metric.pod];
        }
        return acc;
      },
      {}
    );

    res.locals.podNodes = podNodes;
    return next();
  } catch (error) {
    console.log(error);
  }
};
export default { getPodNames, getpodIP, getPodStatuses, getPodNodes };
