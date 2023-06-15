import React, { FC, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pods from './pages/Pods';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import NodeGraph from './components/NodeGraph/NodeGraph';

const App: FC = () => {
  const [url, setUrl] = useState<string>('');
  const [podsUrl, setPodsUrl] = useState<string>('');
  const [klusterUrl, setKlusterUrl] = useState<string>('');
  const [allPodsUrl, setAllPodsUrl] = useState<string>('');
  const [podTitle, setPodTitle] = useState<string>('');
  const [podInfo, setPodInfo] = useState<{ name: string; ip: number }[]>([]);
  const [nodeMapInfo, setNodeMapInfo] = useState<{ [n: string]: string[] }>({});
  const [podStatus, setPodStatus] = useState<{ [p: string]: string }>({});
  const [nodeModalInfo, setnodeModalInfo] = useState<{ [p: string]: string }>(
    {}
  );

  async function getPodNodes(): Promise<void> {
    try {
      const response = await fetch('/prom/pods/nodes');
      const data = await response.json();
      if (data) {
        setNodeMapInfo(data['podNodes']);
        setnodeModalInfo(data['nodeGraph']);
      }
    } catch (error) {
      throw new Error();
    }
  }
  async function getPodStatus(): Promise<void> {
    try {
      const response = await fetch('prom/pod/status');
      const data = await response.json();
      if (data) {
        setPodStatus(data);
      }
    } catch (error) {
      throw new Error();
    }
  }

  // Fetch Metrics dashboard URLs
  const getUrl = async (
    endpoint: string,
    setDashboard: (url: string) => void,
    setOriginalDashboard: (url: string) => void
  ) => {
    try {
      const res = await fetch(endpoint);
      const url = await res.json();
      setDashboard(url);
      setOriginalDashboard(url);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUrl('/grafana/dashboard', setUrl, setKlusterUrl);
    getUrl('/grafana/pods', setPodsUrl, setAllPodsUrl);
    getPodNodes();
    getPodStatus();
  }, []);

  return (
    <>
      <Header />
      <Sidebar
        setPodTitle={setPodTitle}
        url={url}
        setUrl={setUrl}
        podsUrl={podsUrl}
        setPodsUrl={setPodsUrl}
        podInfo={podInfo}
        setPodInfo={setPodInfo}
        klusterUrl={klusterUrl}
        allPodsUrl={allPodsUrl}
        nodeMapInfo={nodeMapInfo}
      />
      <Routes>
        <Route index path='/' element={<Home url={url} />} />
        <Route
          path='/pods/:pod'
          element={<Pods url={podsUrl} podTitle={podTitle} />}
        />
        <Route
          path='/nodegraph/:nodeName'
          element={
            <NodeGraph
              nodeMapInfo={nodeMapInfo}
              podStatus={podStatus}
              modalInfo={nodeModalInfo}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
