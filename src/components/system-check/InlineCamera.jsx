import React, { useRef, useEffect } from 'react';
import DetectionCanvas from './DetectionCanvas';

const InlineCamera = ({ 
  isDetecting, 
  isModelLoading, 
  error, 
  detectedObjects, 
  startDetection, 
  stopDetection 
}) => {
  const detectionVideoRef = useRef(null);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          } 
        });
        
        if (detectionVideoRef.current) {
          detectionVideoRef.current.srcObject = stream;
          
          detectionVideoRef.current.onloadedmetadata = async () => {
            await startDetection(detectionVideoRef.current);
          };
        }
      } catch (error) {
        console.error('Error starting inline camera:', error);
        alert('Failed to access camera. Please check permissions and try again.');
      }
    };

    initializeCamera();

    return () => {
      if (detectionVideoRef.current && detectionVideoRef.current.srcObject) {
        const tracks = detectionVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [startDetection]);

  const handleToggleDetection = async () => {
    if (isDetecting) {
      stopDetection();
    } else {
      if (detectionVideoRef.current) {
        await startDetection(detectionVideoRef.current);
      }
    }
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
     
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <button
          onClick={handleToggleDetection}
          disabled={isModelLoading}
          className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
            isDetecting 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } ${isModelLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isDetecting ? 'Stop' : 'Start'} Detection
        </button>
      </div>

      <video
        ref={detectionVideoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      <DetectionCanvas 
        videoRef={detectionVideoRef} 
        detectedObjects={detectedObjects} 
      />

      {error && (
        <div className="absolute inset-0 bg-red-100 flex items-center justify-center">
          <div className="text-center text-red-700">
            <p className="font-medium">Detection Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InlineCamera;