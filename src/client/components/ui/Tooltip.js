import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const Tooltip = ({ 
  children, 
  content,
  position = 'top',
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  let timeout;

  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'scale(1)' : 'scale(0.95)',
    config: { tension: 300, friction: 20 }
  });

  const positions = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  const handleMouseEnter = () => {
    timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <animated.div 
          style={animation}
          className={`absolute ${positions[position]} z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap`}
        >
          {content}
        </animated.div>
      )}
    </div>
  );
};

export default Tooltip;