import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';
import './index.css';

// React Router v7 future flags to suppress warnings
const routerFuture = {
  v7_prependBasename: true,
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter future={routerFuture}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

