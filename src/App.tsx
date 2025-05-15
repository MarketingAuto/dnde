import React from 'react';
import { HashRouter } from 'react-router-dom';
import Pages from './Pages';
import 'antd/dist/reset.css';
import './App.scss';
import { StoreProvider } from './Store/store';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <div className="my-app">
          <Pages />
        </div>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;
