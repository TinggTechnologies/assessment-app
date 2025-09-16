import { useState, useEffect } from 'react';

const useObjectDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadModel = async () => {
    try {
      setIsModelLoading(true);
      setError(null);
      
      console.log('Loading TensorFlow.js and COCO-SSD from CDN...');
      
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js');
      
      await loadScript('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@latest/dist/coco-ssd.min.js');
      
      if (window.cocoSsd && window.cocoSsd.load) {
        const loadedModel = await window.cocoSsd.load();
        setModel(loadedModel);
        console.log('COCO-SSD model loaded successfully from CDN');
      } else {
        throw new Error('COCO-SSD not available');
      }
    } catch (err) {
      console.error('Error loading model:', err);
      setError('Failed to load object detection model. Using simulation mode.');
    } finally {
      setIsModelLoading(false);
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };

  const detectObjects = async (videoElement) => {
    if (!model || !videoElement || videoElement.videoWidth === 0) return;

    try {
      const predictions = await model.detect(videoElement);
      
      const formattedObjects = predictions.map((prediction, index) => ({
        id: `${Date.now()}-${index}`,
        name: prediction.class,
        confidence: prediction.score,
        x: prediction.bbox[0],
        y: prediction.bbox[1],
        width: prediction.bbox[2],
        height: prediction.bbox[3]
      }));

      const validObjects = formattedObjects.filter(obj => obj.confidence > 0.5);
      setDetectedObjects(validObjects);
    } catch (err) {
      console.error('Detection error:', err);
      simulateObjectDetection();
    }
  };

  const simulateObjectDetection = () => {
    const mockObjects = []; 
    setDetectedObjects(mockObjects);
  };

  const startDetection = async () => {
    if (!model && !isModelLoading) {
      await loadModel();
    }
    setIsDetecting(true);
  };

  const stopDetection = () => {
    setIsDetecting(false);
    setDetectedObjects([]);
  };

  useEffect(() => {
    let interval;
    
    if (isDetecting) {
      interval = setInterval(() => {
        if (model) {
          const videoElement = document.querySelector('video');
          if (videoElement && videoElement.videoWidth > 0) {
            detectObjects(videoElement);
          }
        } else {
          simulateObjectDetection();
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDetecting, model]);

  return {
    isDetecting,
    detectedObjects,
    model,
    isModelLoading,
    error,
    startDetection,
    stopDetection,
    detectObjects
  };
};

export default useObjectDetection;