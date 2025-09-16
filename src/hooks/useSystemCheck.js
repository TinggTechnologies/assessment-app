import { useState } from 'react';

const useSystemCheck = () => {
  const [systemStatus, setSystemStatus] = useState({
    webcam: false,
    speed: false,
    gadgetMic: false,
    lighting: false
  });

  const runSystemChecks = () => {
    setTimeout(() => {
      setSystemStatus(prev => ({ ...prev, webcam: true }));
    }, 500);
    
    setTimeout(() => {
      setSystemStatus(prev => ({ ...prev, gadgetMic: true }));
    }, 1000);
    
    setTimeout(() => {
      setSystemStatus(prev => ({ ...prev, lighting: true }));
    }, 1200);
    
    setTimeout(() => {
      setSystemStatus(prev => ({ 
        ...prev, 
        speed: Math.random() > 0.2
      }));
    }, 1500);
  };

  return { systemStatus, runSystemChecks };
};

export default useSystemCheck;