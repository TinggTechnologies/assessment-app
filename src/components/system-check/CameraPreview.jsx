import React from 'react';
import { Camera } from 'lucide-react';

const CameraPreview = ({ videoRef, stream, onStartCamera, onStopCamera }) => (
  <div className="space-y-4 poppins-regular">
    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <Camera className="w-16 h-16" />
        </div>
      )}
    </div>
    
    <button
      onClick={stream ? onStopCamera : onStartCamera}
      className="w-full text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
      style={{backgroundColor: 'var(--color-primary-light)'}}
    >
      <span>{stream ? 'Stop Camera' : 'Take picture and continue'}</span>
    </button>
  </div>
);

export default CameraPreview;