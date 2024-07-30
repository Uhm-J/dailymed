import React from 'react';

interface GradientSeparatorProps {
  className?: string;
}

const GradientSeparator: React.FC<GradientSeparatorProps> = ({ className = '' }) => {
  return (
    <div 
      className={`
        h-1 
        shadow-sm
        bg-[linear-gradient(to_right,#DFE9ED_0%,#F1BA6D_25%,#57B5A6_50%,#16443C80_75%,#DDE8EC_100%)]
        ${className}
      `}
    ></div>
  );
};

export default GradientSeparator;