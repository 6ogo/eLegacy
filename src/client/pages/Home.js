// src/client/pages/Home.js
import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Empire's Legacy</h1>
          <div className="space-y-4">
            <Button 
              className="w-full"
              onClick={() => window.location.href = '/game/new'}
            >
              Create New Game
            </Button>
            <Button 
              className="w-full"
              variant="outline"
              onClick={() => window.location.href = '/game/join'}
            >
              Join Game
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
