import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/app.scss';
import './styles/normalize.css';
import Pods from './pages/Pods';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
