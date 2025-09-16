import { useState, useEffect } from 'react';

// Import TensorFlow.js with error handling
let tf;
let cocoSsd;

// Try to import TensorFlow.js
try {
  tf = require('@tensorflow/tfjs');
  cocoSsd = require('@tensorflow-models/coco-ssd');
} catch (error) {
  console.warn('TensorFlow.js not available locally, will use CDN fallback');
}

const useObjectDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [model, setModel] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadModel = async () => {
    try {
      setIsModelLoading(true);
      setError(null);
      
      // Try to use local TensorFlow.js first
      if (cocoSsd) {
        console.log('Loading COCO-SSD model from local package...');
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log('COCO-SSD model loaded successfully from local package');
        return;
      }
      
      // Fallback to CDN if local package is not available
      console.log('Loading COCO-SSD model from CDN...');
      const cdnTf = await import('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js');
      const cdnCocoSsd = await import('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@latest/dist/coco-ssd.min.js');
      
      const loadedModel = await cdnCocoSsd.load();
      setModel(loadedModel);
      console.log('COCO-SSD model loaded successfully from CDN');
    } catch (err) {
      console.error('Error loading model:', err);
      setError('Failed to load object detection model. Using simulation mode.');
    } finally {
      setIsModelLoading(false);
    }
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
      // Fall back to simulation if real detection fails
      simulateObjectDetection();
    }
  };

  const simulateObjectDetection = () => {
    const mockObjects = [  
    ];
    
    const validObjects = mockObjects.filter(obj => obj.confidence > 0.7);
    setDetectedObjects(validObjects);
  };

  const addAnnotation = (object, event) => {
    const newAnnotation = {
      id: Date.now(),
      objectId: object.id,
      objectName: object.name,
      event: event,
      timestamp: new Date().toISOString(),
      confidence: object.confidence
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
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

  // Detection loop
  useEffect(() => {
    let interval;
    
    if (isDetecting) {
      // Run detection every second
      interval = setInterval(() => {
        if (model) {
          // Real detection if model is available
          const videoElement = document.querySelector('video');
          if (videoElement && videoElement.videoWidth > 0) {
            detectObjects(videoElement);
          }
        } else {
          // Fallback to simulation
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
    annotations,
    model,
    isModelLoading,
    error,
    startDetection,
    stopDetection,
    addAnnotation,
    detectObjects
  };
};

export default useObjectDetection;