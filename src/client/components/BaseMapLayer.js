// src/client/components/BaseMapLayer.js
import React from 'react';
import { Layer, Group } from 'react-konva';
import { useSelector } from 'react-redux';
import { getTerritoryCenter } from './game/GameAssets';

const BaseMapLayer = () => {
  const territories = useSelector(state => state.map.territories);

  return (
    <Layer>
      <Group>
        {Object.values(territories).map(territory => {
          const center = getTerritoryCenter(territory);
          return (
            <Group key={territory.id} x={center.x} y={center.y}>
              {/* Base hexagon shape */}
              <Line
                points={territory.path}
                closed={true}
                fill="#2d3748"
                stroke="#4a5568"
                strokeWidth={2}
              />
              
              {/* Territory name */}
              <Text
                text={territory.name}
                fill="#fff"
                fontSize={12}
                align="center"
                verticalAlign="middle"
                offsetX={20}
                offsetY={-20}
              />
              
              {/* Resource indicators */}
              {territory.resources.map((resource, index) => (
                <Circle
                  key={resource}
                  x={10 + (index * 15)}
                  y={-10}
                  radius={5}
                  fill={getResourceColor(resource)}
                />
              ))}
            </Group>
          );
        })}
      </Group>
    </Layer>
  );
};

// Helper function to get resource colors
const getResourceColor = (resource) => {
  switch (resource) {
    case 'wood':
      return '#6b4423';
    case 'stone':
      return '#718096';
    case 'gold':
      return '#ecc94b';
    case 'food':
      return '#48bb78';
    default:
      return '#a0aec0';
  }
};

export default BaseMapLayer;