import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-4',
  hoverable = false 
}) => {
  const baseStyles = 'bg-gray-800 rounded-lg shadow-lg';
  const hoverStyles = hoverable ? 'hover:shadow-xl transition-shadow duration-300' : '';
  
  return (
    <div className={`${baseStyles} ${padding} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`font-bold text-lg mb-2 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`text-gray-300 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-3 border-t border-gray-700 ${className}`}>
    {children}
  </div>
);

export default Card;