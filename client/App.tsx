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
  const [klusterUrl, setKlusterUrl] = useState<string>('');
  const [podTitle, setPodTitle] = useState<string>('');
  const [podInfo, setPodInfo] = useState<{ name: string; ip: number }[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  /*
  ///////   Check Status   ////////
  ///////////////////////////////////////////////
  const fetchStatus = async (endpoint, post) => {
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
        getUrl();
        setModalVisible(false);
      } else {
        setModalVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStatus('/status', false);
  }, []);
  */

  const getUrl = async () => {
    try {
      const res = await fetch('/grafana/dashboard');
      const url = await res.json();
      setUrl(url);
      setKlusterUrl(url);
    } catch (error) {
      console.log(error);
    }
    // setUrl('https://picsum.photos/id/237/1537/693');
    // setKlusterUrl('https://picsum.photos/id/237/1537/693');
  };

  useEffect(() => {
    getUrl();
  }, []);

  return (
    <>
      <Header />
      <Sidebar
        setPodTitle={setPodTitle}
        url={url}
        setUrl={setUrl}
        podInfo={podInfo}
        setPodInfo={setPodInfo}
        klusterUrl={klusterUrl}
      />
      <Routes>
        <Route path='/' element={<Home url={url} />} />
        <Route
          path='/pods/:pod'
          element={<Pods url={url} podTitle={podTitle} />}
        />
      </Routes>

      {/* <ModalContainer modalVisible={modalVisible} />
      <Modal modalVisible={modalVisible} fetchStatus={fetchStatus} /> */}
    </>
  );
};

export default App;
