// Action Types
export const ActionTypes = {
    MOVE_UNITS: 'MOVE_UNITS',
    ATTACK: 'ATTACK',
    COLLECT_RESOURCES: 'COLLECT_RESOURCES',
    BUILD: 'BUILD',
    END_TURN: 'END_TURN',
    USE_ABILITY: 'USE_ABILITY'
  };
  
  // Action Handlers
  export const processAction = async (gameState, action) => {
    switch (action.type) {
      case ActionTypes.MOVE_UNITS:
        return handleMoveUnits(gameState, action);
      case ActionTypes.ATTACK:
        return handleAttack(gameState, action);
      case ActionTypes.COLLECT_RESOURCES:
        return handleCollectResources(gameState, action);
      case ActionTypes.BUILD:
        return handleBuild(gameState, action);
      case ActionTypes.END_TURN:
        return handleEndTurn(gameState, action);
      case ActionTypes.USE_ABILITY:
        return handleUseAbility(gameState, action);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  };
  
  // Individual Action Handlers
  const handleMoveUnits = (gameState, action) => {
    const { fromTerritory, toTerritory, units } = action.payload;
    const newState = { ...gameState };
    
    // Validate move
    if (!areTerritoryConnected(fromTerritory, toTerritory)) {
      throw new Error('Territories not connected');
    }
  
    // Update unit positions
    newState.map.territories[fromTerritory].units -= units;
    newState.map.territories[toTerritory].units += units;
  
    return newState;
  };
  
  const handleAttack = (gameState, action) => {
    const { attacker, defender, units } = action.payload;
    const newState = { ...gameState };
    
    // Calculate battle result
    const battleResult = resolveBattle(
      units,
      newState.map.territories[defender].units
    );
  
    // Update territories based on battle result
    newState.map.territories[attacker].units -= battleResult.attackerLosses;
    newState.map.territories[defender].units -= battleResult.defenderLosses;
  
    // Handle territory capture if defender has no units
    if (newState.map.territories[defender].units <= 0) {
      newState.map.territories[defender].owner = newState.map.territories[attacker].owner;
      newState.map.territories[defender].units = battleResult.remainingAttackers;
    }
  
    return newState;
  };
  
  const handleCollectResources = (gameState, action) => {
    const { playerId } = action.payload;
    const newState = { ...gameState };
    const player = newState.players.find(p => p.id === playerId);
    
    // Calculate resources from territories
    const territories = Object.values(newState.map.territories)
      .filter(t => t.owner === playerId);
    
    const resources = calculateResources(territories, player.dynasty);
    
    // Update player resources
    player.resources = {
      gold: player.resources.gold + resources.gold,
      influence: player.resources.influence + resources.influence,
      power: player.resources.power + resources.power
    };
  
    return newState;
  };
  
  const handleBuild = (gameState, action) => {
    const { playerId, territoryId, buildingType } = action.payload;
    const newState = { ...gameState };
    const player = newState.players.find(p => p.id === playerId);
    
    // Verify resources
    const cost = getBuildingCost(buildingType);
    if (!hasEnoughResources(player.resources, cost)) {
      throw new Error('Insufficient resources');
    }
    
    // Add building
    newState.map.territories[territoryId].buildings.push({
      type: buildingType,
      owner: playerId
    });
    
    // Deduct resources
    player.resources = subtractResources(player.resources, cost);
  
    return newState;
  };
  
  const handleEndTurn = (gameState, action) => {
    const newState = { ...gameState };
    
    // Update turn counter
    newState.currentTurn++;
    
    // Reset phase
    newState.phase = 'RESOURCE';
    
    // Update current player
    const playerCount = newState.players.length;
    newState.currentPlayer = newState.players[newState.currentTurn % playerCount].id;
    
    return newState;
  };
  
  // Helper Functions
  const resolveBattle = (attackingUnits, defendingUnits) => {
    // Implement battle resolution logic
    return {
      attackerLosses: 0,
      defenderLosses: 0,
      remainingAttackers: attackingUnits
    };
  };
  
  const calculateResources = (territories, dynasty) => {
    // Implement resource calculation logic
    return {
      gold: 0,
      influence: 0,
      power: 0
    };
  };
  
  const getBuildingCost = (buildingType) => {
    // Implement building cost calculation
    return {
      gold: 0,
      influence: 0,
      power: 0
    };
  };
  
  export default {
    processAction,
    ActionTypes
  };