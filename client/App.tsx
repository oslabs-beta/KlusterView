import React, { FC, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pods from './pages/Pods';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import ModalContainer from './components/Modal/ModalContainer';
import Modal from './components/Modal/Modal';

const App: FC = () => {
  const [url, setUrl] = useState<string>('');
  const [podsUrl, setPodsUrl] = useState<string>('');
  const [klusterUrl, setKlusterUrl] = useState<string>('');
  const [allPodsUrl, setAllPodsUrl] = useState<string>('');
  const [podTitle, setPodTitle] = useState<string>('');
  const [podInfo, setPodInfo] = useState<{ name: string; ip: number }[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Check Status
  const fetchStatus = async (endpoint: string, post: boolean) => {
    try {
      const res = !post
        ? await fetch(endpoint)
        : await fetch(endpoint, {
            method: 'Post',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      if (res.ok) {
        getUrl('/grafana/dashboard', setUrl, setKlusterUrl);
        setModalVisible(false);
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStatus('/status/init', false);
  }, []);

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
      />
      <Routes>
        <Route index path='/' element={<Home url={url} />} />
        <Route
          path='/pods/:pod'
          element={<Pods url={podsUrl} podTitle={podTitle} />}
        />
      </Routes>
      {/* <ModalContainer modalVisible={modalVisible} />
      <Modal modalVisible={modalVisible} fetchStatus={fetchStatus} /> */}
    </>
  );
};

export default App;
