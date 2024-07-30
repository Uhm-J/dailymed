import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;
  if (percentage === 0 || (current === 0 && total === 0)) return null;
  return (
    <div className="w-full bg-subtleBackground rounded-full p-1 shadow-md">
      <div className="flex items-center">
        <div 
          className="bg-primary/80 h-2 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${percentage}%` }}
        ></div>
        <span className="text-xs font-medium text-primary font-kameron ml-2">
          {current} of {total}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;