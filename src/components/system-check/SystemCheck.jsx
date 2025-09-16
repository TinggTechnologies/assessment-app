import React, { useState, useRef, useEffect } from 'react';
import { Play, Camera, Wifi, Mic, Lightbulb } from 'lucide-react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import CameraPreview from './CameraPreview';
import SystemStatusItem from './SystemStatusItem';
import StartAssessmentModal from './StartAssessmentModal';
import useTimer from '../../hooks/useTimer';
import useCamera from '../../hooks/useCamera';
import useSystemCheck from '../../hooks/useSystemCheck';
import useObjectDetection from '../../hooks/useObjectDetection';
import { INITIAL_MINUTES } from '../../utils/constants';

const SystemCheck = () => {
  const { formattedTime } = useTimer(INITIAL_MINUTES);
  const { videoRef, stream, startCamera, stopCamera } = useCamera();
  const { systemStatus, runSystemChecks } = useSystemCheck();
  const [showStartModal, setShowStartModal] = useState(false);
  const [hasBeenChecked, setHasBeenChecked] = useState(false);
  const [showInlineCamera, setShowInlineCamera] = useState(false);
  
  // Object detection setup for inline camera
  const detectionVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  
  const {
    isDetecting,
    detectedObjects,
    model,
    isModelLoading,
    error,
    startDetection,
    stopDetection,
    detectObjects
  } = useObjectDetection();

  const handleStartCamera = async () => {
    try {
      await startCamera();
      await runSystemChecks();
      setHasBeenChecked(true);
      setShowStartModal(true);
    } catch (error) {
      alert('Failed to access camera. Please check permissions.');
    }
  };

  const handleProceedFromModal = async () => {
    setShowStartModal(false);
    setShowInlineCamera(true);
    
    // Start inline camera with object detection
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

  const handleToggleDetection = async () => {
    if (isDetecting) {
      stopDetection();
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    } else {
      if (detectionVideoRef.current && model) {
        await startDetection(detectionVideoRef.current);
      }
    }
  };

  // Function to draw bounding boxes
  const drawBoundingBoxes = () => {
    const canvas = canvasRef.current;
    const video = detectionVideoRef.current;
    
    if (!canvas || !video || !detectedObjects.length) return;
    
    const ctx = canvas.getContext('2d');
    const { videoWidth, videoHeight } = video;
    const { offsetWidth, offsetHeight } = canvas;
    
    // Set canvas dimensions to match video display size
    canvas.width = offsetWidth;
    canvas.height = offsetHeight;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scaling factors
    const scaleX = offsetWidth / videoWidth;
    const scaleY = offsetHeight / videoHeight;
    
    // Draw bounding boxes
    detectedObjects.forEach((obj) => {
      const x = obj.x * scaleX;
      const y = obj.y * scaleY;
      const width = obj.width * scaleX;
      const height = obj.height * scaleY;
      
      // Draw red bounding box
      ctx.strokeStyle = '#ef4444'; // Red color
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label background
      const label = `${obj.name} ${Math.round(obj.confidence * 100)}%`;
      ctx.font = '14px Arial';
      const textWidth = ctx.measureText(label).width;
      const textHeight = 20;
      
      // Background rectangle for label
      ctx.fillStyle = '#ef4444'; // Red background
      ctx.fillRect(x, y - textHeight, textWidth + 8, textHeight);
      
      // Label text
      ctx.fillStyle = 'white';
      ctx.fillText(label, x + 4, y - 4);
    });
  };

  // Object detection interval with bounding box drawing
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
  }, [isDetecting, model, detectObjects]);

  // Draw bounding boxes whenever detectedObjects changes
  useEffect(() => {
    if (showInlineCamera && detectedObjects.length > 0) {
      drawBoundingBoxes();
    } else if (canvasRef.current) {
      // Clear canvas when no objects detected
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [detectedObjects, showInlineCamera]);

  // Handle window resize to redraw bounding boxes
  useEffect(() => {
    const handleResize = () => {
      if (showInlineCamera && detectedObjects.length > 0) {
        setTimeout(drawBoundingBoxes, 100); // Small delay to ensure canvas is resized
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showInlineCamera, detectedObjects]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (detectionVideoRef.current && detectionVideoRef.current.srcObject) {
        const tracks = detectionVideoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const canStartAssessment = stream && Object.values(systemStatus).some(status => status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header timeLeft={formattedTime} />

      <div className="flex-1 max-w-4xl mx-auto p-6 w-full">
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System check</h2>
          
          <p className="text-gray-600 leading-relaxed mb-8">
            We utilize your camera image to ensure fairness for all participants, and we also employ both your camera and 
            microphone for a video questions where you will be prompted to record a response using your camera or webcam, 
            so it's essential to verify that your camera and microphone are functioning correctly and that you have a stable 
            internet connection. To do this, please position yourself in front of your camera, ensuring that your entire face is 
            clearly visible on the screen. This includes your forehead, eyes, ears, nose, and lips. You can initiate a 
            5-second recording of yourself by clicking the button below.
          </p>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Camera Section */}
            <div>
              {!showInlineCamera ? (
                <CameraPreview 
                  videoRef={videoRef}
                  stream={stream}
                  onStartCamera={handleStartCamera}
                  onStopCamera={stopCamera}
                />
              ) : (
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  {/* Detection Status Header */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
                    
                    {/* <button
                      onClick={handleToggleDetection}
                      disabled={isModelLoading}
                      className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                        isDetecting 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } ${isModelLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isDetecting ? 'Stop' : 'Start'} Detection
                    </button> */}
                  </div>

                  {/* Video Feed */}
                  <video
                    ref={detectionVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Canvas for object detection overlay */}
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
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
              )}
            </div>

            {/* System Status Grid */}
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
          </div>

          {formattedTime === "0:00" && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-center">
              <p className="text-red-700 font-medium">Time has expired!</p>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <StartAssessmentModal 
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        onProceed={handleProceedFromModal}
      />
    </div>
  );
};

export default SystemCheck;