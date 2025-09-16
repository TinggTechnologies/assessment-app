import React from 'react';
import { Camera, Wifi, Mic, Lightbulb } from 'lucide-react';
import SystemStatusItem from './SystemStatusItem';

const SystemStatusGrid = ({ systemStatus, hasBeenChecked }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SystemStatusItem 
        icon={Camera} 
        label="Webcam" 
        status={systemStatus.webcam}
        hasBeenChecked={hasBeenChecked}
      />
      <SystemStatusItem 
        icon={Wifi} 
        label="Speed" 
        status={systemStatus.speed}
        hasBeenChecked={hasBeenChecked}
      />
      <SystemStatusItem 
        icon={Mic} 
        label="Gadget mic" 
        status={systemStatus.gadgetMic}
        hasBeenChecked={hasBeenChecked}
      />
      <SystemStatusItem 
        icon={Lightbulb} 
        label="Lighting" 
        status={systemStatus.lighting}
        hasBeenChecked={hasBeenChecked}
      />
    </div>
  );
};

export default SystemStatusGrid;