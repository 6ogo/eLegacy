import express from 'express';
import GameManager from '../../game/GameManager';
import { validateAction } from '../middleware/validation';
import { ActionDB, GameDB } from '../../db/mysql';

const router = express.Router();

// Get game state
router.get('/:gameId', async (req, res) => {
  try {
    const gameState = await GameManager.getGame(req.params.gameId);
    if (!gameState) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(gameState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new game
router.post('/', async (req, res) => {
  try {
    const { players, settings } = req.body;
    const gameId = await GameManager.createGame(players, settings);
    res.status(201).json({ gameId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Perform game action
router.post('/:gameId/action', validateAction, async (req, res) => {
  try {
    const { gameId } = req.params;
    const action = {
      ...req.body,
      playerId: req.user.id,
      timestamp: Date.now()
    };

    const updatedState = await GameManager.handleAction(gameId, action);
    res.json(updatedState);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get game history/actions
router.get('/:gameId/history', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { turn } = req.query;
    
    const actions = await ActionDB.getGameActions(gameId, turn);
    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player status in game
router.get('/:gameId/players/:playerId', async (req, res) => {
  try {
    const { gameId, playerId } = req.params;
    const game = await GameManager.getGame(gameId);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found in game' });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Forfeit/leave game
router.post('/:gameId/forfeit', async (req, res) => {
  try {
    const { gameId } = req.params;
    const playerId = req.user.id;
    
    await GameManager.handleForfeit(gameId, playerId);
    res.json({ message: 'Successfully forfeited game' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Save game state (for long games)
router.post('/:gameId/save', async (req, res) => {
  try {
    const { gameId } = req.params;
    await GameManager.saveGameState(gameId);
    res.json({ message: 'Game state saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get valid moves for a territory
router.get('/:gameId/territories/:territoryId/moves', async (req, res) => {
  try {
    const { gameId, territoryId } = req.params;
    const validMoves = await GameManager.getValidMoves(gameId, territoryId);
    res.json(validMoves);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get combat preview
router.get('/:gameId/combat-preview', async (req, res) => {
  try {
    const { attackingTerritory, defendingTerritory, units } = req.query;
    const preview = await GameManager.getCombatPreview(
      req.params.gameId,
      attackingTerritory,
      defendingTerritory,
      parseInt(units)
    );
    res.json(preview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get game statistics
router.get('/:gameId/stats', async (req, res) => {
  try {
    const { gameId } = req.params;
    const stats = await GameDB.getGameStats(gameId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End turn
router.post('/:gameId/end-turn', async (req, res) => {
  try {
    const { gameId } = req.params;
    const playerId = req.user.id;
    
    const updatedState = await GameManager.handleEndTurn(gameId, playerId);
    res.json(updatedState);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;