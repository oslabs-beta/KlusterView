import { MiddlewareFn } from '../types';
import axios from 'axios';

interface PodMetric {
  metric: {
    pod: string;
    pod_ip: string;
  };
}

const getPodNames: MiddlewareFn = async (req, res, next) => {
  try {
    console.log('Trying to retrieve pod names');

    const response = await axios.get(
      'http://localhost:9999/api/v1/query?query=kube_pod_info'
    );

    const podMetrics = response.data.data.result as PodMetric[];
    const podNames: string[] = podMetrics.map((item) => item.metric.pod);

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
      'http://localhost:9999/api/v1/query?query=kube_pod_info'
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
