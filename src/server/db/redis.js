import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

export const SessionStore = {
  async setSession(userId, sessionData, ttl = 3600) {
    const key = `session:${userId}`;
    await redis.setex(key, ttl, JSON.stringify(sessionData));
  },

  async getSession(userId) {
    const key = `session:${userId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }
};

export const MatchMaking = {
  async addToQueue(userId, preferences) {
    const key = `matchmaking:${userId}`;
    await redis.setex(key, 300, JSON.stringify({ 
      userId, 
      preferences,
      timestamp: Date.now() 
    }));
  },

  async removeFromQueue(userId) {
    const key = `matchmaking:${userId}`;
    await redis.del(key);
  },

  async getQueuedPlayers() {
    const keys = await redis.keys('matchmaking:*');
    if (keys.length === 0) return [];
    
    const players = await Promise.all(
      keys.map(async (key) => {
        const data = await redis.get(key);
        return JSON.parse(data);
      })
    );
    
    return players.sort((a, b) => a.timestamp - b.timestamp);
  }
};

export const GameState = {
  async cacheGameState(gameId, state, ttl = 3600) {
    const key = `game:${gameId}:state`;
    await redis.setex(key, ttl, JSON.stringify(state));
  },

  async getCachedGameState(gameId) {
    const key = `game:${gameId}:state`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async invalidateGameState(gameId) {
    const key = `game:${gameId}:state`;
    await redis.del(key);
  }
};

export default redis;