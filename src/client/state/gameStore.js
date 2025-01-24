// src/client/state/gameStore.js
import create from 'zustand';

const useGameStore = create((set, get) => ({
  // Game state
  gameId: null,
  players: [],
  territories: [],
  currentPlayer: null,
  phase: 'SETUP', // SETUP, DEPLOY, ACTION, COMBAT, END
  selectedTerritory: null,
  
  // Game settings
  settings: {
    maxPlayers: 4,
    mapSize: 'medium',
    gameMode: 'classic',
  },

  // Actions
  setGame: (gameId) => set({ gameId }),
  
  setPlayers: (players) => set({ players }),
  
  updateTerritory: (territoryId, updates) => set((state) => ({
    territories: state.territories.map(territory =>
      territory.id === territoryId ? { ...territory, ...updates } : territory
    ),
  })),
  
  selectTerritory: (territoryId) => set({ selectedTerritory: territoryId }),
  
  setPhase: (phase) => set({ phase }),
  
  // Game logic actions
  deployUnits: (territoryId, units) => {
    const state = get();
    if (state.phase !== 'DEPLOY') return false;
    // Implementation will go here
  },
  
  moveUnits: (fromId, toId, units) => {
    const state = get();
    if (state.phase !== 'ACTION') return false;
    // Implementation will go here
  },
  
  attack: (fromId, toId, units) => {
    const state = get();
    if (state.phase !== 'COMBAT') return false;
    // Implementation will go here
  },
  
  endTurn: () => {
    const state = get();
    // Implementation will go here
  },
}));

export default useGameStore;