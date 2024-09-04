import React from 'react';
import './App.css';
import Graph from './Components/graph';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Toontown Rewritten Population App</h1>
      </header>
      <main> 
        <Graph/>
      </main>
    </div>
  );
}

export default App;
