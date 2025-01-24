import React, { useState, useCallback } from 'react';
import BaseMapLayer from './BaseMapLayer';
import UnitLayer from './UnitLayer';
import FXLayer from './FXLayer';

const MapSystem = ({ gameState, onAction }) => {
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [mapScale, setMapScale] = useState(1);
  const [effects, setEffects] = useState([]);

  // UI Controls
  const MapControls = () => (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      <button 
        className="p-2 bg-blue-500 rounded-full text-white"
        onClick={() => setMapScale(s => Math.min(s + 0.1, 2))}
      >
        +
      </button>
      <button 
        className="p-2 bg-blue-500 rounded-full text-white"
        onClick={() => setMapScale(s => Math.max(s - 0.1, 0.5))}
      >
        -
      </button>
    </div>
  );

  // Territory Info Panel
  const TerritoryInfo = () => {
    if (!selectedTerritory) return null;
    
    const territory = gameState.territories[selectedTerritory];
    
    return (
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-bold">{territory.name}</h3>
        <p>Owner: {territory.owner}</p>
        <p>Units: {territory.units}</p>
        <div className="mt-2 flex gap-2">
          <button 
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => onAction('DEPLOY', { territoryId: selectedTerritory })}
          >
            Deploy
          </button>
          <button 
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={() => onAction('ATTACK', { territoryId: selectedTerritory })}
          >
            Attack
          </button>
        </div>
      </div>
    );
  };

  // Handle territory selection
  const handleTerritoryClick = useCallback((territoryId) => {
    setSelectedTerritory(territoryId);
    // Add selection effect
    setEffects(prev => [...prev, {
      type: 'selection',
      position: gameState.territories[territoryId].position,
      color: [1, 1, 0]
    }]);
  }, [gameState]);

  return (
    <div className="relative w-full h-full">
      {/* Base Map Layer */}
      <BaseMapLayer 
        territories={gameState.territories}
        onTerritoryClick={handleTerritoryClick}
      />
      
      {/* Unit Layer */}
      <UnitLayer 
        units={gameState.units}
        mapScale={mapScale}
      />
      
      {/* Effects Layer */}
      <FXLayer 
        effects={effects}
      />
      
      {/* UI Controls */}
      <MapControls />
      <TerritoryInfo />
      
      {/* Mouse Position Overlay */}
      <div className="absolute inset-0" 
           style={{ transform: `scale(${mapScale})` }}
           onWheel={(e) => {
             const delta = e.deltaY * -0.01;
             setMapScale(s => Math.max(0.5, Math.min(2, s + delta)));
           }}
      />
    </div>
  );
};

export default MapSystem;