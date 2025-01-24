export const validateAction = (req, res, next) => {
    const { type, payload } = req.body;
  
    if (!type) {
      return res.status(400).json({ error: 'Action type is required' });
    }
  
    // Validate different action types
    switch (type) {
      case 'MOVE_UNITS':
        if (!payload?.fromTerritory || !payload?.toTerritory || !payload?.units) {
          return res.status(400).json({ error: 'Invalid move units payload' });
        }
        break;
  
      case 'ATTACK':
        if (!payload?.attackingTerritory || !payload?.defendingTerritory || !payload?.units) {
          return res.status(400).json({ error: 'Invalid attack payload' });
        }
        break;
  
      case 'BUILD':
        if (!payload?.territory || !payload?.buildingType) {
          return res.status(400).json({ error: 'Invalid build payload' });
        }
        break;
    }
  
    next();
  };