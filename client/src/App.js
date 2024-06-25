import React from 'react';
import './App.css';
import PopulationData from './PopulationData';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Toontown Rewritten Population App</h1>
      </header>
      <main>
        <PopulationData />
      </main>
    </div>
  );
}

export default App;
