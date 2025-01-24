import React, { useEffect, useRef } from 'react';

const UnitLayer = ({ units, mapScale }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Setup canvas for proper resolution
    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    // Draw units
    const drawUnits = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      units.forEach(unit => {
        const { x, y, type, owner } = unit;
        
        // Draw unit circle
        ctx.beginPath();
        ctx.arc(x * mapScale, y * mapScale, 10, 0, Math.PI * 2);
        ctx.fillStyle = owner.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw unit count
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(unit.count.toString(), x * mapScale, y * mapScale);
      });
    };

    setupCanvas();
    drawUnits();

    // Redraw on resize
    const handleResize = () => {
      setupCanvas();
      drawUnits();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [units, mapScale]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default UnitLayer;