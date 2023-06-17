import { MiddlewareFn } from '../types';
import axios from 'axios';
import { getNodeIPs } from './initializationController';

//const IPList = getNodeIPs();
const GRAF_IP = 'grafana'; //IPList[0];
const GRAF_NODE_PORT = '3000';

//CREATING UNIX TIMESTAMP VALUES FOR "FROM" & "TO"
const timeStamp = () => {
  const currentTime = Date.now();
  const timeRangeInMinutes = 15;
  const timeRangeInMilliseconds = timeRangeInMinutes * 60 * 1000;
  const from = currentTime - timeRangeInMilliseconds;
  const to = currentTime;
  return { from, to };
};
//ACCESSING DASHBOARD DETAILS LIKE URI AND UID
async function getDashboard(resource: number): Promise<{
  dashboardUid: string;
  dashboardUri: string;
}> {
  try {
    // getAuthToken();

    const response = await axios.get(
      `http://admin:admin@${GRAF_IP}:${GRAF_NODE_PORT}/api/search?type=dash-db`
    );
    const dashboards = response.data;
    const dashboard = dashboards[resource];
    const dashboardUid = dashboard.uid;
    const length = dashboard.uri.split('/').length;
    const dashboardUri = dashboard.uri.split('/')[length - 1];
    return { dashboardUid, dashboardUri };
  } catch (error) {
    throw error;
  }
}
//middleware functions that gets pod dashboard which is first dashboard
const getPods: MiddlewareFn = async (req, res, next) => {
  const { from, to } = timeStamp();
  try {
    const { dashboardUid, dashboardUri } = await getDashboard(1);
    const src = `/grafanasvc/d/${dashboardUid}/${dashboardUri}/?orgId=1&refresh=30s&var-Node=All&var-Pod=All&var-Pod_ip=192.168.49.2&from=${from}&to=${to}`;
    res.locals.src = src;
    return next();
  } catch (error) {
    return next({
      log: 'Express error handler caught getPods middleware error',
      status: 404,
      message: { err: 'Could not find the dashboard' }
    });
  }
};
//middleware functions that gets main/cluster dashboard which is second dashboard
const getCluster: MiddlewareFn = async (req, res, next) => {
  const { from, to } = timeStamp();
  try {
    const { dashboardUid, dashboardUri } = await getDashboard(0);
    const src = `/grafanasvc/d/${dashboardUid}/${dashboardUri}/?orgId=1`;
    res.locals.src = src;
    return next();
  } catch (error) {
    return next({
      log: 'Express error handler caught getPods middleware error',
      status: 404,
      message: { err: 'Could not find the dashboard' }
    });
  }
};

export default { getPods, getCluster };
