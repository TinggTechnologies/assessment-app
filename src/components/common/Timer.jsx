import React from 'react';
import useTimer from '../../hooks/useTimer';

const Timer = ({ initialMinutes = 30 }) => {
  const { formattedTime, isExpired } = useTimer(initialMinutes);
  
  return (
    <div className="flex items-center space-x-2 text-purple-600">
      <span className="font-medium">{formattedTime} time left</span>
      {isExpired && (
        <span className="text-red-500 text-sm">(Expired)</span>
      )}
    </div>
  );
};

export default Timer;