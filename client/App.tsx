import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pods from './pages/Pods';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/pods' element={<Pods />} />
      </Routes>
    </>
  );
};

export default App;
