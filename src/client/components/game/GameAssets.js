// src/client/components/game/GameAssets.js
import { v4 as uuidv4 } from 'uuid';

// Define hexagon geometry helper
const createHexPath = (x, y, size) => {
  const angle = Math.PI / 3;
  const points = [];
  for (let i = 0; i < 6; i++) {
    points.push(x + size * Math.cos(angle * i));
    points.push(y + size * Math.sin(angle * i));
  }
  return points;
};

// Territory definitions
const TERRITORY_SIZE = 60;
const GRID_SPACING = TERRITORY_SIZE * 2;

export const loadGameAssets = async () => {
  // Define initial territories in a hex grid pattern
  const territories = {};
  const gridSize = 5; // 5x5 grid of territories
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const id = uuidv4();
      const x = col * GRID_SPACING + (row % 2 ? TERRITORY_SIZE : 0);
      const y = row * GRID_SPACING * 0.866; // height factor for hexagons
      
      territories[id] = {
        id,
        name: `Territory ${row}-${col}`,
        owner: null,
        units: 0,
        position: { x, y },
        path: createHexPath(x, y, TERRITORY_SIZE),
        adjacentTerritories: [], // Will be populated after all territories are created
        resources: ['gold', 'wood'].filter(() => Math.random() > 0.7),
        bonuses: [],
        status: 'normal'
      };
    }
  }

  // Calculate adjacent territories
  Object.keys(territories).forEach(id => {
    const territory = territories[id];
    const { x, y } = territory.position;
    
    // Find neighboring territories within range
    territory.adjacentTerritories = Object.keys(territories).filter(otherId => {
      if (otherId === id) return false;
      const other = territories[otherId];
      const dx = other.position.x - x;
      const dy = other.position.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= GRID_SPACING * 1.1; // Slight buffer for hex grid
    });
  });

  // Define initial resource distribution
  const resourceTypes = ['wood', 'stone', 'gold', 'food'];
  Object.values(territories).forEach(territory => {
    if (Math.random() > 0.7) { // 30% chance of having a resource
      territory.resources.push(
        resourceTypes[Math.floor(Math.random() * resourceTypes.length)]
      );
    }
  });

  // Define strategic bonus locations
  const bonusTypes = ['defense', 'attack', 'production'];
  Object.values(territories).forEach(territory => {
    if (Math.random() > 0.8) { // 20% chance of having a bonus
      territory.bonuses.push({
        type: bonusTypes[Math.floor(Math.random() * bonusTypes.length)],
        value: Math.floor(Math.random() * 20 + 10) // 10-30% bonus
      });
    }
  });

  return {
    territories,
    assets: {
      textures: {
        terrain: {
          grass: '/assets/textures/grass.png',
          forest: '/assets/textures/forest.png',
          mountain: '/assets/textures/mountain.png',
          water: '/assets/textures/water.png'
        },
        units: {
          infantry: '/assets/units/infantry.png',
          cavalry: '/assets/units/cavalry.png',
          artillery: '/assets/units/artillery.png'
        },
        resources: {
          wood: '/assets/resources/wood.png',
          stone: '/assets/resources/stone.png',
          gold: '/assets/resources/gold.png',
          food: '/assets/resources/food.png'
        },
        effects: {
          selection: '/assets/effects/selection.png',
          attack: '/assets/effects/attack.png',
          movement: '/assets/effects/movement.png'
        }
      },
      config: {
        territorySize: TERRITORY_SIZE,
        gridSpacing: GRID_SPACING,
        resourceScale: 0.5,
        unitScale: 0.7,
        effectScale: 1.2
      }
    }
  };
};

// Helper functions for game assets
export const getTerritoryCenter = (territory) => {
  return {
    x: territory.position.x,
    y: territory.position.y
  };
};

export const calculatePath = (fromTerritory, toTerritory) => {
  const start = getTerritoryCenter(fromTerritory);
  const end = getTerritoryCenter(toTerritory);
  
  return {
    type: 'line',
    points: [start.x, start.y, end.x, end.y]
  };
};

export const getResourcePosition = (territory, index) => {
  const center = getTerritoryCenter(territory);
  const angle = (index / territory.resources.length) * Math.PI * 2;
  const radius = TERRITORY_SIZE * 0.5;
  
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius
  };
};

export const getUnitPosition = (territory, unitType, index) => {
  const center = getTerritoryCenter(territory);
  const radius = TERRITORY_SIZE * 0.3;
  const angle = (index / 3) * Math.PI * 2; // 3 unit types max
  
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius
  };
};