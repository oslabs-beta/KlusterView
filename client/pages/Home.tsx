import React, { FC } from 'react';
import Dashboard from '../components/Dashboard/Dashboard';
import './pages.scss';

interface HomeProps {
  url: string;
}

const Home: FC<HomeProps> = ({ url }) => {
  return (
    <div className='page'>
      <h1 className='page-title'>Kluster Metrics</h1>
      <Dashboard url={url} />
    </div>
  );
};

export default Home;
