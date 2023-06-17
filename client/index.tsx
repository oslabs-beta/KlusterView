import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/app.scss';
import './styles/normalize.css';

fetch('/status/init')
  .then((r) => console.log(`Status check: response with code ${r.status}`))
  .catch((e) => console.log(`Received error on status check: ${e}`));

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
