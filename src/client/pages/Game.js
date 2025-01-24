// src/client/pages/Game.js
import React, { useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import BaseMapLayer from '../components/BaseMapLayer';
import UnitLayer from '../components/UnitLayer';
import FXLayer from '../components/FXLayer';
import { getTerritoryCenter } from '../components/game/GameAssets';
import { 
  setTerritories, 
  setLoadingState,
  setSelectedTerritory 
} from '../state/mapSlice';

const Game = () => {
  const dispatch = useDispatch();
  const territories = useSelector(state => state.map.territories);
  const selectedTerritory = useSelector(state => state.map.interaction.selectedTerritory);
  const viewPort = useSelector(state => state.map.viewPort);

  useEffect(() => {
    // Load initial game state
    dispatch(setLoadingState('loading'));
    // ... load territories
    dispatch(setLoadingState('idle'));
  }, [dispatch]);

  const handleStageClick = (e) => {
    const clickedPoint = e.target.getStage().getPointerPosition();
    
    // Find clicked territory
    const clickedTerritory = Object.values(territories).find(territory => {
      const center = getTerritoryCenter(territory);
      const dx = clickedPoint.x - center.x;
      const dy = clickedPoint.y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 30; // Territory click radius
    });

    if (clickedTerritory) {
      dispatch(setSelectedTerritory(clickedTerritory.id));
    } else {
      dispatch(setSelectedTerritory(null));
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-900">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleStageClick}
        draggable
        x={viewPort.x}
        y={viewPort.y}
        scale={{ x: viewPort.zoom, y: viewPort.zoom }}
      >
        <BaseMapLayer />
        <UnitLayer />
        <FXLayer />
      </Stage>
    </div>
  );
};

export default Game;