import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pods from './pages/Pods';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';

const App = () => {
  const [url, setUrl] = useState<string>('');
  const [klusterUrl, setKlusterUrl] = useState<string>('');
  const [podTitle, setPodTitle] = useState<string>('');
  const [podNames, setPodNames] = useState<{ name: string }[]>([]);

  const getUrl = async () => {
    // try {
    //   const res = await fetch('/grafana/dashboard');
    //   const url = await res.json();
    //   setUrl(url);
    // } catch (error) {
    //   console.log(error);
    // }
    setUrl('https://picsum.photos/id/237/200/300');
    setKlusterUrl('https://picsum.photos/id/237/200/300');
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
        podNames={podNames}
        setPodNames={setPodNames}
        klusterUrl={klusterUrl}
      />
      <Routes>
        <Route path='/' element={<Home url={url} />} />
        <Route path='/pods' element={<Pods url={url} podTitle={podTitle} />} />
      </Routes>
    </>
  );
};

export default App;
