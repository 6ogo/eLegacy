// src/server/game/WebSocketManager.js
import { WebSocketServer } from 'ws';
import { GameDB, ActionDB } from '../db/mysql';

class WebSocketManager {
  constructor(server) {
    this.wss = new WebSocketServer({ server });
    this.games = new Map(); // gameId -> Set of player websockets
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      let gameId = null;
      let playerId = null;

      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          
          switch (data.type) {
            case 'join_game':
              gameId = data.gameId;
              playerId = data.playerId;
              this.addPlayerToGame(gameId, playerId, ws);
              break;

            case 'game_action':
              await this.handleGameAction(gameId, data.action);
              break;

            case 'request_sync':
              await this.syncGameState(gameId, ws);
              break;
          }
        } catch (error) {
          ws.send(JSON.stringify({
            type: 'error',
            message: error.message
          }));
        }
      });

      ws.on('close', () => {
        if (gameId) {
          this.removePlayerFromGame(gameId, playerId);
        }
      });
    });
  }

  addPlayerToGame(gameId, playerId, ws) {
    if (!this.games.has(gameId)) {
      this.games.set(gameId, new Map());
    }
    this.games.get(gameId).set(playerId, ws);
  }

  removePlayerFromGame(gameId, playerId) {
    if (this.games.has(gameId)) {
      this.games.get(gameId).delete(playerId);
      if (this.games.get(gameId).size === 0) {
        this.games.delete(gameId);
      }
    }
  }

  async handleGameAction(gameId, action) {
    // Log action to database
    await ActionDB.logAction({
      id: action.id,
      gameId,
      playerId: action.playerId,
      type: action.type,
      data: action.data,
      turnNumber: action.turnNumber
    });

    // Process action and get updated game state
    const gameState = await GameDB.getGameSession(gameId);
    const updatedState = await this.processAction(gameState, action);
    
    // Update database
    await GameDB.updateGameState(gameId, updatedState);

    // Broadcast to all players in game
    this.broadcastToGame(gameId, {
      type: 'game_update',
      state: updatedState
    });
  }

  async syncGameState(gameId, ws) {
    const gameState = await GameDB.getGameSession(gameId);
    ws.send(JSON.stringify({
      type: 'sync_state',
      state: gameState
    }));
  }

  broadcastToGame(gameId, data) {
    if (this.games.has(gameId)) {
      const players = this.games.get(gameId);
      players.forEach(ws => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify(data));
        }
      });
    }
  }

  async processAction(gameState, action) {
    // Implement game logic here
    switch (action.type) {
      case 'MOVE_UNITS':
        // Process unit movement
        break;
      case 'ATTACK':
        // Process attack
        break;
      case 'END_TURN':
        // Process end turn
        break;
      // Add more action types as needed
    }
    return gameState;
  }
}

export default WebSocketManager;