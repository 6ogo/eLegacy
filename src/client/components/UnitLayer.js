// src/client/components/UnitLayer.js
import React from 'react';
import { Layer, Group, Circle, Text } from 'react-konva';
import { useSelector } from 'react-redux';
import { getTerritoryCenter } from './game/GameAssets';

const UnitLayer = () => {
  const units = useSelector(state => state.map.units);
  const territories = useSelector(state => state.map.territories);

  return (
    <Layer>
      {Object.values(units).map(unit => {
        const territory = territories[unit.territoryId];
        if (!territory) return null;

        const center = getTerritoryCenter(territory);
        const color = getUnitColor(unit.type);

        return (
          <Group key={unit.id} x={center.x} y={center.y}>
            {/* Unit circle */}
            <Circle
              radius={15}
              fill={color}
              stroke="#fff"
              strokeWidth={2}
            />
            
            {/* Unit count */}
            <Text
              text={unit.count.toString()}
              fill="#fff"
              fontSize={12}
              align="center"
              verticalAlign="middle"
              offsetX={-6}
              offsetY={-6}
            />
          </Group>
        );
      })}
    </Layer>
  );
};

// Helper function to get unit colors
const getUnitColor = (unitType) => {
  switch (unitType) {
    case 'infantry':
      return '#3182ce';
    case 'cavalry':
      return '#805ad5';
    case 'artillery':
      return '#e53e3e';
    default:
      return '#718096';
  }
};

export default UnitLayer;