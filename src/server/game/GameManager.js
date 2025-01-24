import { v4 as uuidv4 } from 'uuid';
import { GameDB, PlayerDB } from '../db/mysql';
import { GameState } from '../db/redis';
import { processAction } from './actions';

class GameManager {
  constructor() {
    this.activeGames = new Map();
  }

  async createGame(players, settings = {}) {
    const gameId = uuidv4();
    
    // Initialize game state
    const initialState = {
      id: gameId,
      players: players.map((player, index) => ({
        id: player.id,
        dynasty: player.dynasty,
        resources: {
          gold: 100,
          influence: 50,
          power: 25
        },
        territories: [],
        turnOrder: index
      })),
      map: this.generateInitialMap(),
      currentTurn: 0,
      phase: 'SETUP',
      settings
    };

    // Save to database
    await GameDB.createSession({
      id: gameId,
      mapState: initialState,
      turnPhase: 'SETUP'
    });

    // Add players to game
    for (const player of initialState.players) {
      await PlayerDB.addPlayer(gameId, player);
    }

    // Cache initial state
    await GameState.cacheGameState(gameId, initialState);
    
    this.activeGames.set(gameId, initialState);
    return gameId;
  }

  async getGame(gameId) {
    // Try cache first
    let gameState = await GameState.getCachedGameState(gameId);
    
    // If not in cache, get from DB
    if (!gameState) {
      gameState = await GameDB.getGameSession(gameId);
      if (gameState) {
        await GameState.cacheGameState(gameId, gameState);
      }
    }
    
    return gameState;
  }

  async handleAction(gameId, action) {
    const game = await this.getGame(gameId);
    if (!game) throw new Error('Game not found');

    // Validate action
    if (!this.isValidAction(game, action)) {
      throw new Error('Invalid action');
    }

    // Process action
    const updatedState = await processAction(game, action);

    // Update database and cache
    await GameDB.updateGameState(gameId, updatedState);
    await GameState.cacheGameState(gameId, updatedState);

    return updatedState;
  }

  async endGame(gameId, winner) {
    const game = await this.getGame(gameId);
    if (!game) throw new Error('Game not found');

    // Update game status
    game.status = 'COMPLETED';
    game.winner = winner;

    // Update database
    await GameDB.updateGameState(gameId, game);
    
    // Clear from cache and active games
    await GameState.invalidateGameState(gameId);
    this.activeGames.delete(gameId);

    return game;
  }

  isValidAction(game, action) {
    // Implement action validation logic
    const { type, playerId } = action;
    
    // Check if it's player's turn
    if (game.currentPlayer !== playerId) return false;
    
    // Check if action is valid for current phase
    const validActions = {
      SETUP: ['PLACE_UNIT'],
      RESOURCE: ['COLLECT_RESOURCES'],
      ACTION: ['MOVE', 'ATTACK', 'BUILD'],
      FORTIFICATION: ['FORTIFY', 'END_TURN']
    };

    return validActions[game.phase]?.includes(type);
  }

  generateInitialMap() {
    // Implement map generation logic
    return {
      territories: {},
      connections: {},
      resources: {}
    };
  }
}

export default new GameManager();