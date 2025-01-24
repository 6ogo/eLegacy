import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGame } from './hooks/useGame';

// Import pages
import Home from './pages/Home';
import Game from './pages/Game';
import Lobby from './pages/Lobby';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:gameId" element={<Game />} />
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </div>
  );
};

export default App;