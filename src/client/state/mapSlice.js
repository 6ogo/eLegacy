// mapSlice.js
import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  territories: {
    // Territory data structure
    // id: {
    //   id: string,
    //   name: string,
    //   owner: string | null,
    //   units: number,
    //   position: { x: number, y: number },
    //   adjacentTerritories: string[],
    //   resources: string[],
    //   bonuses: any[],
    //   status: 'normal' | 'selected' | 'targeted' | 'highlighted'
    // }
  },
  units: {
    // Unit data structure
    // id: {
    //   id: string,
    //   type: 'infantry' | 'cavalry' | 'artillery',
    //   owner: string,
    //   territoryId: string,
    //   count: number,
    //   status: 'idle' | 'moving' | 'attacking' | 'defending'
    // }
  },
  effects: {
    // Visual effects
    // id: {
    //   id: string,
    //   type: 'selection' | 'attack' | 'movement' | 'highlight',
    //   position: { x: number, y: number },
    //   duration: number,
    //   color: [number, number, number],
    //   timestamp: number
    // }
  },
  viewPort: {
    x: 0,
    y: 0,
    zoom: 1,
    rotation: 0,
    bounds: {
      minX: -1000,
      maxX: 1000,
      minY: -500,
      maxY: 500
    }
  },
  interaction: {
    selectedTerritory: null,
    selectedUnits: [],
    hoverTerritory: null,
    dragStart: null,
    dragEnd: null,
    mode: 'view' | 'deploy' | 'attack' | 'move'
  },
  mapScale: 1,
  loadingState: 'idle' | 'loading' | 'error',
  error: null
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    // Territory Actions
    setTerritories: (state, action) => {
      state.territories = action.payload;
    },
    updateTerritory: (state, action) => {
      const { id, ...changes } = action.payload;
      state.territories[id] = { ...state.territories[id], ...changes };
    },
    setTerritoryOwner: (state, action) => {
      const { territoryId, owner } = action.payload;
      state.territories[territoryId].owner = owner;
    },
    setTerritoryUnits: (state, action) => {
      const { territoryId, units } = action.payload;
      state.territories[territoryId].units = units;
    },

    // Unit Actions
    addUnit: (state, action) => {
      const { id, unit } = action.payload;
      state.units[id] = unit;
    },
    removeUnit: (state, action) => {
      delete state.units[action.payload];
    },
    moveUnits: (state, action) => {
      const { units, fromTerritory, toTerritory } = action.payload;
      units.forEach(unitId => {
        state.units[unitId].territoryId = toTerritory;
      });
    },
    updateUnitCount: (state, action) => {
      const { unitId, count } = action.payload;
      state.units[unitId].count = count;
    },

    // Effect Actions
    addEffect: (state, action) => {
      const { id, effect } = action.payload;
      state.effects[id] = { ...effect, timestamp: Date.now() };
    },
    removeEffect: (state, action) => {
      delete state.effects[action.payload];
    },
    clearEffects: (state) => {
      state.effects = {};
    },

    // Viewport Actions
    updateViewPort: (state, action) => {
      state.viewPort = { ...state.viewPort, ...action.payload };
    },
    setZoom: (state, action) => {
      state.viewPort.zoom = Math.max(0.5, Math.min(2, action.payload));
    },
    panMap: (state, action) => {
      const { deltaX, deltaY } = action.payload;
      state.viewPort.x += deltaX;
      state.viewPort.y += deltaY;
      
      // Ensure within bounds
      state.viewPort.x = Math.max(state.viewPort.bounds.minX, 
                                 Math.min(state.viewPort.bounds.maxX, state.viewPort.x));
      state.viewPort.y = Math.max(state.viewPort.bounds.minY, 
                                 Math.min(state.viewPort.bounds.maxY, state.viewPort.y));
    },

    // Interaction Actions
    setSelectedTerritory: (state, action) => {
      state.interaction.selectedTerritory = action.payload;
    },
    setHoverTerritory: (state, action) => {
      state.interaction.hoverTerritory = action.payload;
    },
    setInteractionMode: (state, action) => {
      state.interaction.mode = action.payload;
    },
    startDrag: (state, action) => {
      state.interaction.dragStart = action.payload;
    },
    endDrag: (state, action) => {
      state.interaction.dragEnd = action.payload;
      state.interaction.dragStart = null;
    },

    // Status Actions
    setLoadingState: (state, action) => {
      state.loadingState = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

// Selectors
export const selectTerritory = (state, territoryId) => 
  state.map.territories[territoryId];

export const selectTerritoryUnits = (state, territoryId) =>
  Object.values(state.map.units).filter(unit => 
    unit.territoryId === territoryId
  );

export const selectPlayerTerritories = (state, playerId) =>
  Object.values(state.map.territories).filter(territory => 
    territory.owner === playerId
  );

export const selectAdjacentTerritories = (state, territoryId) => {
  const territory = state.map.territories[territoryId];
  return territory.adjacentTerritories.map(id => 
    state.map.territories[id]
  );
};

export const selectValidAttackTargets = createSelector(
  [state => state.map.territories, 
   state => state.map.interaction.selectedTerritory,
   state => state.auth.playerId],
  (territories, selectedId, playerId) => {
    if (!selectedId) return [];
    const selected = territories[selectedId];
    if (selected.owner !== playerId) return [];
    
    return selected.adjacentTerritories
      .filter(id => territories[id].owner !== playerId);
  }
);

// Action Creators
export const {
  setTerritories,
  updateTerritory,
  setTerritoryOwner,
  setTerritoryUnits,
  addUnit,
  removeUnit,
  moveUnits,
  updateUnitCount,
  addEffect,
  removeEffect,
  clearEffects,
  updateViewPort,
  setZoom,
  panMap,
  setSelectedTerritory,
  setHoverTerritory,
  setInteractionMode,
  startDrag,
  endDrag,
  setLoadingState,
  setError
} = mapSlice.actions;

export default mapSlice.reducer;