import React from 'react';
import { Navbar } from './components';

export const App = () => {
  return (
    <div className="App" style={{ alignItems: 'center' }}>
      <Navbar />
      <div style={{ height: '50vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1>A lot of interesting NFTs will be located here.</h1>
      </div>
    </div>
  );
}
