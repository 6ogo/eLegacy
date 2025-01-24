export const GAME_CONSTANTS = {
    MAX_PLAYERS: 6,
    MIN_PLAYERS: 2,
    STARTING_RESOURCES: {
      gold: 100,
      influence: 50,
      power: 25
    },
    UNIT_COSTS: {
      infantry: { gold: 10, power: 5 },
      cavalry: { gold: 20, power: 10 },
      artillery: { gold: 30, power: 15 }
    },
    BUILDING_COSTS: {
      fortress: { gold: 50, power: 20 },
      market: { gold: 30, influence: 20 },
      temple: { influence: 40, power: 10 },
      barracks: { gold: 40, power: 15 }
    },
    TERRITORY_INCOME: {
      basic: { gold: 5, influence: 3, power: 2 },
      strategic: { gold: 8, influence: 5, power: 4 },
      capital: { gold: 12, influence: 8, power: 6 }
    }
  };