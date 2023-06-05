import React, { FC } from 'react';
import Dashboard from '../components/Dashboard/Dashboard';
import './pages.scss';

interface PodsProps {
  url: string;
  podTitle: string;
}

const Pods: FC<PodsProps> = ({ url, podTitle }) => {
  return (
    <div className='page'>
      <h1 className='page-title'>{podTitle} Metrics</h1>
      <Dashboard url={url} />
    </div>
  );
};

export default Pods;
