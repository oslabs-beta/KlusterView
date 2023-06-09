import { MiddlewareFn } from '../types';
import axios from 'axios';
import { getNodeIPs } from './initializationController';

interface PodMetric {
  metric: {
    pod: string;
    pod_ip: string;
  };
}

//const IPList = getNodeIPs();
const PROM_IP = 'prometheus-service.monitoring-kv.svc.cluster.local'//IPList[0];
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
export default { getPodNames, getpodIP };
