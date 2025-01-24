import { GAME_CONSTANTS } from '../../shared/constants';

export const calculateResourcesNeeded = (unitType, quantity) => {
  const unitCost = GAME_CONSTANTS.UNIT_COSTS[unitType];
  return {
    gold: unitCost.gold * quantity,
    power: unitCost.power * quantity
  };
};

export const canAffordPurchase = (playerResources, cost) => {
  return Object.entries(cost).every(([resource, amount]) => 
    playerResources[resource] >= amount
  );
};

export const calculateTerritoryCounts = (territories, playerId) => {
  return territories.reduce((counts, territory) => {
    if (territory.owner === playerId) {
      counts.owned++;
      if (territory.buildings.some(b => b.type === 'fortress')) {
        counts.fortified++;
      }
    }
    return counts;
  }, { owned: 0, fortified: 0 });
};

export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};