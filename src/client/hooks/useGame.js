import { useState, useEffect, useCallback } from 'react';
import { GameAPI } from '../lib/api';
import websocket from '../lib/websocket';

export const useGame = (gameId) => {
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial game state
  useEffect(() => {
    const loadGame = async () => {
      try {
        const game = await GameAPI.getGame(gameId);
        setGameState(game);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!gameId) return;

    websocket.connect(gameId);

    websocket.on('gameUpdate', (newState) => {
      setGameState(newState);
    });

    return () => websocket.disconnect();
  }, [gameId]);

  // Game actions
  const performAction = useCallback(async (action) => {
    try {
      const result = await GameAPI.performAction(gameId, action);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [gameId]);

  const endTurn = useCallback(async () => {
    try {
      await GameAPI.endTurn(gameId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [gameId]);

  return {
    gameState,
    loading,
    error,
    performAction,
    endTurn
  };
};