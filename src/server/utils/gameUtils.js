export const calculateResourceGeneration = (territories, dynasty) => {
    let resources = {
      gold: 0,
      influence: 0,
      power: 0
    };
  
    territories.forEach(territory => {
      // Base resources from territory
      if (territory.resources) {
        Object.entries(territory.resources).forEach(([resource, amount]) => {
          resources[resource] += amount;
        });
      }
    });
  
    // Apply dynasty bonuses
    if (dynasty.resourceBonus) {
      Object.entries(dynasty.resourceBonus).forEach(([resource, multiplier]) => {
        resources[resource] *= multiplier;
      });
    }
  
    return resources;
  };
  
  export const calculateBattleResult = (attackers, defenders) => {
    // Battle calculation logic
    const attackStrength = Math.floor(Math.random() * attackers);
    const defenseStrength = Math.floor(Math.random() * defenders);
  
    return {
      attackerLosses: Math.min(Math.floor(defenseStrength / 2), attackers),
      defenderLosses: Math.min(Math.floor(attackStrength / 2), defenders),
    };
  };
  
  export const validateMove = (fromTerritory, toTerritory, gameState) => {
    // Check if territories are adjacent
    if (!fromTerritory.adjacentTerritories.includes(toTerritory.id)) {
      return false;
    }
  
    // Check if path is blocked
    const blockedByEnemy = gameState.territories.some(territory => 
      territory.owner !== fromTerritory.owner &&
      territory.id !== toTerritory.id &&
      territory.units > 0
    );
  
    return !blockedByEnemy;
  };