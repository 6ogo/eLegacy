// src/server/db/mysql.js
import mysql from 'mysql2/promise';
import { createPool } from 'mysql2';

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Database query wrapper with automatic connection handling
export async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

// Game session operations
export const GameDB = {
  async createSession(sessionData) {
    const { id, mapState, turnPhase } = sessionData;
    return await query(
      'INSERT INTO game_sessions (id, map_state, turn_phase) VALUES (?, ?, ?)',
      [id, JSON.stringify(mapState), turnPhase]
    );
  },

  async updateGameState(sessionId, newState) {
    return await query(
      'UPDATE game_sessions SET map_state = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(newState), sessionId]
    );
  },

  async getGameSession(sessionId) {
    const [session] = await query(
      'SELECT * FROM game_sessions WHERE id = ?',
      [sessionId]
    );
    if (session) {
      session.map_state = JSON.parse(session.map_state);
    }
    return session;
  }
};

// Player operations
export const PlayerDB = {
  async addPlayer(gameId, userData) {
    return await query(
      'INSERT INTO game_players (id, game_id, user_id, dynasty, player_state, turn_order) VALUES (?, ?, ?, ?, ?, ?)',
      [userData.id, gameId, userData.userId, userData.dynasty, JSON.stringify(userData.state), userData.turnOrder]
    );
  },

  async updatePlayerState(playerId, newState) {
    return await query(
      'UPDATE game_players SET player_state = ? WHERE id = ?',
      [JSON.stringify(newState), playerId]
    );
  }
};

// Game actions logging
export const ActionDB = {
  async logAction(actionData) {
    return await query(
      'INSERT INTO game_actions (id, game_id, player_id, action_type, action_data, turn_number) VALUES (?, ?, ?, ?, ?, ?)',
      [actionData.id, actionData.gameId, actionData.playerId, actionData.type, JSON.stringify(actionData.data), actionData.turnNumber]
    );
  },

  async getGameActions(gameId, turnNumber) {
    return await query(
      'SELECT * FROM game_actions WHERE game_id = ? AND turn_number = ? ORDER BY created_at ASC',
      [gameId, turnNumber]
    );
  }
};