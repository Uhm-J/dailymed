import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number; // Time in seconds
  onTimeUp: () => void;
  isAnswered: boolean;
  questionIndex: number; // Add this prop
  onTimeChange: (time: number) => void;

}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, isAnswered, questionIndex, onTimeChange }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime); // Reset the timer when the question changes
  }, [questionIndex, initialTime]);

  useEffect(() => {
    if (timeLeft <= 0 || isAnswered) {
      if (timeLeft <= 0) {
        onTimeUp();
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(time => {
        const newTime = time - 1;
        onTimeChange(newTime); // Call this function to update the parent component
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp, isAnswered, onTimeChange]);

  const percentage = (timeLeft / initialTime) * 100;

  return (
    <div className="w-full bg-subtleBackground rounded-full p-1 shadow-md mt-4">
      <div className="flex items-center">
        <div 
          className="bg-accent/80 h-2 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${percentage}%` }}
        ></div>
        <span className="text-xs font-medium text-primary font-kameron ml-2">
          {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
          {(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default Timer;