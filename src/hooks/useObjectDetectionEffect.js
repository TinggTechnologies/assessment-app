import { useEffect, useRef } from 'react';

const useObjectDetectionEffect = (isDetecting, model, detectObjects, detectionVideoRef) => {
  const detectionIntervalRef = useRef(null);

  useEffect(() => {
    if (isDetecting && model && detectionVideoRef.current) {
      const runDetection = async () => {
        if (detectionVideoRef.current && detectionVideoRef.current.videoWidth > 0) {
          await detectObjects(detectionVideoRef.current);
        }
      };

      detectionIntervalRef.current = setInterval(runDetection, 1000);
      
      return () => {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
        }
      };
    }
  }, [isDetecting, model, detectObjects, detectionVideoRef]);

  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  return detectionIntervalRef;
};

export default useObjectDetectionEffect;