import React from 'react';
import { getTerritoryCenter } from './game/GameAssets';

const BaseMapLayer = ({ territories, onTerritoryClick }) => {
  return (
    <svg 
      viewBox="0 0 1000 500" 
      className="w-full h-full absolute top-0 left-0"
    >
      {/* World Map Base */}
      <defs>
        <pattern id="territoryPattern" patternUnits="userSpaceOnUse" width="10" height="10">
          <circle cx="5" cy="5" r="1" fill="currentColor" fillOpacity="0.3"/>
        </pattern>
      </defs>

      {/* Continents */}
      <g id="north-america">
        <path 
          d="M 150 120 L 280 120 L 310 180 L 280 240 L 150 240 Z" 
          className="territory hover:opacity-80 cursor-pointer"
          fill="currentColor"
          stroke="#333"
          strokeWidth="2"
          onClick={() => onTerritoryClick('north-america')}
        />
      </g>

      <g id="south-america">
        <path 
          d="M 200 260 L 280 260 L 310 350 L 250 420 L 180 380 Z"
          className="territory hover:opacity-80 cursor-pointer"
          fill="currentColor"
          stroke="#333"
          strokeWidth="2"
          onClick={() => onTerritoryClick('south-america')}
        />
      </g>

      <g id="europe">
        <path 
          d="M 450 120 L 520 120 L 540 180 L 500 220 L 440 200 Z"
          className="territory hover:opacity-80 cursor-pointer"
          fill="currentColor"
          stroke="#333"
          strokeWidth="2"
          onClick={() => onTerritoryClick('europe')}
        />
      </g>

      {/* Territory Labels */}
      <g id="labels" className="text-sm">
        <text x="220" y="180" textAnchor="middle">North America</text>
        <text x="240" y="340" textAnchor="middle">South America</text>
        <text x="480" y="160" textAnchor="middle">Europe</text>
      </g>
    </svg>
  );
};

export default BaseMapLayer;