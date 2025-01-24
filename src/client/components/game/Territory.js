// src/client/components/game/Territory.js
import React from 'react';
import { Group, Path, Text } from 'react-konva';

const Territory = ({
  id,
  name,
  path,
  position,
  owner,
  units,
  isSelected,
  isOwned,
  status,
  onDragStart,
  onDragEnd
}) => {
  const getColor = () => {
    if (isSelected) return '#4CAF50';
    if (status === 'targeted') return '#F44336';
    if (status === 'highlighted') return '#2196F3';
    return owner ? ownerColors[owner] : '#9E9E9E';
  };

  const ownerColors = {
    player1: '#E91E63',
    player2: '#2196F3',
    player3: '#4CAF50',
    player4: '#FFC107'
  };

  return (
    <Group
      id={id}
      x={position.x}
      y={position.y}
      draggable={isOwned}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Path
        data={path}
        fill={getColor()}
        stroke="#ffffff"
        strokeWidth={2}
        opacity={0.8}
        shadowColor="black"
        shadowBlur={10}
        shadowOpacity={0.3}
        shadowOffset={{ x: 2, y: 2 }}
      />
      
      <Text
        text={name}
        fill="#ffffff"
        fontSize={14}
        fontFamily="Arial"
        x={10}
        y={10}
        padding={5}
        align="center"
      />
      
      <Text
        text={`Units: ${units}`}
        fill="#ffffff"
        fontSize={12}
        fontFamily="Arial"
        x={10}
        y={30}
        padding={5}
      />
    </Group>
  );
};

export default Territory;