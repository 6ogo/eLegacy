import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const GameAPI = {
  // Game state management
  async getGame(gameId) {
    const response = await api.get(`/games/${gameId}`);
    return response.data;
  },

  async createGame(players, settings) {
    const response = await api.post('/games', { players, settings });
    return response.data;
  },

  async performAction(gameId, action) {
    const response = await api.post(`/games/${gameId}/action`, action);
    return response.data;
  },

  async getHistory(gameId, turn) {
    const response = await api.get(`/games/${gameId}/history`, { 
      params: { turn } 
    });
    return response.data;
  },

  async forfeitGame(gameId) {
    const response = await api.post(`/games/${gameId}/forfeit`);
    return response.data;
  },

  async saveGame(gameId) {
    const response = await api.post(`/games/${gameId}/save`);
    return response.data;
  },

  async getValidMoves(gameId, territoryId) {
    const response = await api.get(`/games/${gameId}/territories/${territoryId}/moves`);
    return response.data;
  },

  async getCombatPreview(gameId, attackingTerritory, defendingTerritory, units) {
    const response = await api.get(`/games/${gameId}/combat-preview`, {
      params: { attackingTerritory, defendingTerritory, units }
    });
    return response.data;
  },

  async getGameStats(gameId) {
    const response = await api.get(`/games/${gameId}/stats`);
    return response.data;
  },

  async endTurn(gameId) {
    const response = await api.post(`/games/${gameId}/end-turn`);
    return response.data;
  }
};

export const UserAPI = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(updates) {
    const response = await api.patch('/auth/profile', updates);
    return response.data;
  }
};

export const MatchmakingAPI = {
  async joinQueue(preferences) {
    const response = await api.post('/matchmaking/queue', preferences);
    return response.data;
  },

  async leaveQueue() {
    const response = await api.delete('/matchmaking/queue');
    return response.data;
  },

  async getQueueStatus() {
    const response = await api.get('/matchmaking/status');
    return response.data;
  }
};

export default api;