class GameWebSocket {
    constructor() {
      this.ws = null;
      this.reconnectAttempts = 0;
      this.maxReconnectAttempts = 5;
      this.listeners = new Map();
      this.gameId = null;
      this.playerId = null;
    }
  
    connect(gameId, playerId) {
      this.gameId = gameId;
      this.playerId = playerId;
  
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/game`;
      
      this.ws = new WebSocket(wsUrl);
  
      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.sendMessage({
          type: 'join_game',
          gameId,
          playerId
        });
        this.emit('connected');
      };
  
      this.ws.onclose = () => {
        this.emit('disconnected');
        this.handleReconnect();
      };
  
      this.ws.onerror = (error) => {
        this.emit('error', error);
      };
  
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    }
  
    handleMessage(data) {
      switch (data.type) {
        case 'game_update':
          this.emit('gameUpdate', data.state);
          break;
  
        case 'action_result':
          this.emit('actionResult', data);
          break;
  
        case 'player_joined':
          this.emit('playerJoined', data.player);
          break;
  
        case 'player_left':
          this.emit('playerLeft', data.player);
          break;
  
        case 'chat_message':
          this.emit('chatMessage', data.message);
          break;
  
        case 'error':
          this.emit('error', data.error);
          break;
  
        default:
          console.warn('Unknown message type:', data.type);
      }
    }
  
    handleReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
        
        setTimeout(() => {
          if (this.gameId && this.playerId) {
            this.connect(this.gameId, this.playerId);
          }
        }, delay);
      } else {
        this.emit('reconnectFailed');
      }
    }
  
    sendMessage(message) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(message));
        return true;
      }
      return false;
    }
  
    sendGameAction(action) {
      return this.sendMessage({
        type: 'game_action',
        action: {
          ...action,
          gameId: this.gameId,
          playerId: this.playerId,
          timestamp: Date.now()
        }
      });
    }
  
    sendChatMessage(message) {
      return this.sendMessage({
        type: 'chat_message',
        gameId: this.gameId,
        playerId: this.playerId,
        message,
        timestamp: Date.now()
      });
    }
  
    requestSync() {
      return this.sendMessage({
        type: 'request_sync',
        gameId: this.gameId
      });
    }
  
    on(event, callback) {
      if (!this.listeners.has(event)) {
        this.listeners.set(event, new Set());
      }
      this.listeners.get(event).add(callback);
    }
  
    off(event, callback) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).delete(callback);
      }
    }
  
    emit(event, data) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error(`Error in ${event} listener:`, error);
          }
        });
      }
    }
  
    disconnect() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
        this.gameId = null;
        this.playerId = null;
        this.listeners.clear();
      }
    }
  }
  
  export default new GameWebSocket();