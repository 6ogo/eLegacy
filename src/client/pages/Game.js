// src/client/pages/Game.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Stage, Layer } from 'react-konva';
import { loadGameAssets } from '../components/game/GameAssets';
import Territory from '../components/game/Territory';
import { BaseMapLayer } from '../components/BaseMapLayer';
import { UnitLayer } from '../components/UnitLayer';
import { FXLayer } from '../components/FXLayer';
import { 
  setTerritories, 
  setLoadingState,
  updateViewPort,
  setZoom,
  panMap
} from '../state/mapSlice';

const Game = () => {
  const dispatch = useDispatch();
  const viewPort = useSelector(state => state.map.viewPort);
  const territories = useSelector(state => state.map.territories);
  const loadingState = useSelector(state => state.map.loadingState);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        dispatch(setLoadingState('loading'));
        const assets = await loadGameAssets();
        dispatch(setTerritories(assets.territories));
        dispatch(setLoadingState('idle'));
      } catch (error) {
        dispatch(setLoadingState('error'));
        console.error('Failed to initialize game:', error);
      }
    };

    initializeGame();
  }, [dispatch]);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const oldScale = viewPort.zoom;
    const pointer = e.target.getStage().getPointerPosition();

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    dispatch(setZoom(newScale));

    // Adjust position to zoom toward mouse pointer
    const deltaX = (pointer.x - viewPort.x) * (1 - 1 / scaleBy);
    const deltaY = (pointer.y - viewPort.y) * (1 - 1 / scaleBy);
    dispatch(panMap({ deltaX, deltaY }));
  };

  if (loadingState === 'loading') {
    return <div>Loading game assets...</div>;
  }

  if (loadingState === 'error') {
    return <div>Error loading game assets</div>;
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-gray-900">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={handleWheel}
        draggable
        x={viewPort.x}
        y={viewPort.y}
        scale={{ x: viewPort.zoom, y: viewPort.zoom }}
      >
        <Layer>
          <BaseMapLayer />
          {Object.values(territories).map(territory => (
            <Territory
              key={territory.id}
              {...territory}
            />
          ))}
          <UnitLayer />
          <FXLayer />
        </Layer>
      </Stage>
    </div>
  );
};

export default Game;