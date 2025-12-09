
import React from 'react';

interface ChaseLogoProps {
  className?: string;
}

const ChaseLogo: React.FC<ChaseLogoProps> = ({ className = "h-8 w-8 text-white" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="currentColor" 
      className={className}
      aria-hidden="true"
      role="img"
    >
      {/* 
        The Chase logo is an abstract octagon composed of four wedge-shaped prisms. 
        This path approximates that geometric "fortress" shape.
      */}
      <path d="M 68 0 L 100 32 L 100 68 L 68 100 L 32 100 L 0 68 L 0 32 L 32 0 Z M 68 20 L 80 32 L 80 68 L 68 80 L 32 80 L 20 68 L 20 32 L 32 20 Z" fillRule="evenodd" />
    </svg>
  );
};

export default ChaseLogo;
