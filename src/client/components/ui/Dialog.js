import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const Dialog = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md' 
}) => {
  const animation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(-40px)',
    config: { tension: 280, friction: 20 }
  });

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-max overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-75" 
          onClick={onClose}
        />

        <animated.div 
          style={animation}
          className={`inline-block w-full ${sizes[size]} p-6 my-8 overflow-hidden text-left align-middle bg-gray-800 rounded-lg shadow-xl transform transition-all`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="mt-2">
            {children}
          </div>
        </animated.div>
      </div>
    </div>
  );
};

export default Dialog;