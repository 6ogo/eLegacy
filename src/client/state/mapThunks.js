// mapThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  setTerritories, 
  updateTerritory,
  addEffect,
  setError,
  setLoadingState
} from './mapSlice';

// Load initial map data
export const initializeMap = createAsyncThunk(
  'map/initialize',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoadingState('loading'));
      const response = await fetch('/api/map/initial-state');
      const data = await response.json();
      
      dispatch(setTerritories(data.territories));
      return data;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    } finally {
      dispatch(setLoadingState('idle'));
    }
  }
);

// Handle territory attack
export const attackTerritory = createAsyncThunk(
  'map/attack',
  async ({ from, to, units }, { dispatch, getState }) => {
    try {
      // Add attack animation effect
      const effect = {
        id: `attack-${Date.now()}`,
        type: 'attack',
        from: from.position,
        to: to.position,
        duration: 1000
      };
      dispatch(addEffect(effect));

      // Send attack to server
      const response = await fetch('/api/game/attack', {
        method: 'POST',
        body: JSON.stringify({ from, to, units })
      });
      const result = await response.json();

      // Update territories based on battle result
      dispatch(updateTerritory({ 
        id: from.id, 
        units: result.fromUnitsRemaining 
      }));
      dispatch(updateTerritory({ 
        id: to.id, 
        units: result.toUnitsRemaining,
        owner: result.newOwner 
      }));

      return result;
    } catch (error) {
      dispatch(setError('Attack failed: ' + error.message));
      throw error;
    }
  }
);

// Handle unit movement
export const moveUnits = createAsyncThunk(
  'map/moveUnits',
  async ({ units, fromTerritory, toTerritory }, { dispatch }) => {
    try {
      // Add movement animation effect
      const effect = {
        id: `move-${Date.now()}`,
        type: 'movement',
        from: fromTerritory.position,
        to: toTerritory.position,
        duration: 800
      };
      dispatch(addEffect(effect));

      // Send movement to server
      const response = await fetch('/api/game/move-units', {
        method: 'POST',
        body: JSON.stringify({ units, fromTerritory, toTerritory })
      });
      
      if (!response.ok) {
        throw new Error('Movement failed');
      }

      return await response.json();
    } catch (error) {
      dispatch(setError('Movement failed: ' + error.message));
      throw error;
    }
  }
);

// Handle territory selection
export const selectTerritory = createAsyncThunk(
  'map/selectTerritory',
  async (territoryId, { dispatch, getState }) => {
    const state = getState();
    const territory = state.map.territories[territoryId];

    if (!territory) {
      throw new Error('Invalid territory');
    }

    // Add selection effect
    dispatch(addEffect({
      id: `select-${territoryId}`,
      type: 'selection',
      position: territory.position,
      duration: -1 // Permanent until deselected
    }));

    // Highlight adjacent territories
    territory.adjacentTerritories.forEach(adjId => {
      dispatch(addEffect({
        id: `adjacent-${adjId}`,
        type: 'highlight',
        position: state.map.territories[adjId].position,
        duration: -1
      }));
    });

    return territory;
  }
);

// Handle map viewport updates
export const updateMapView = createAsyncThunk(
  'map/updateView',
  async ({ x, y, zoom }, { dispatch, getState }) => {
    const state = getState();
    const bounds = state.map.viewPort.bounds;

    // Ensure viewport stays within bounds
    const newX = Math.max(bounds.minX, Math.min(bounds.maxX, x));
    const newY = Math.max(bounds.minY, Math.min(bounds.maxY, y));
    const newZoom = Math.max(0.5, Math.min(2, zoom));

    dispatch(updateViewPort({
      x: newX,
      y: newY,
      zoom: newZoom
    }));

    return { x: newX, y: newY, zoom: newZoom };
  }
);