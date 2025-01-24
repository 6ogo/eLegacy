// src/client/pages/Lobby.js
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';

export default function Lobby() {
  const [players, setPlayers] = useState([]);
  const [gameSettings, setGameSettings] = useState({
    maxPlayers: 4,
    mapSize: 'medium',
    gameMode: 'classic'
  });

  useEffect(() => {
    // Connect to WebSocket and listen for player updates
    // This will be implemented later
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Game Lobby</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl mb-4">Players</h3>
              <div className="space-y-2">
                {players.map(player => (
                  <div key={player.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span>{player.name}</span>
                    <span className="text-green-400">Ready</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl mb-4">Game Settings</h3>
              {/* Game settings controls will go here */}
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Leave Lobby
            </Button>
            <Button>
              Start Game
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
