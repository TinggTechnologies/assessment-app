import React, { useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import CameraPreview from './CameraPreview';
import SystemStatusGrid from './SystemStatusGrid';
import InlineCamera from './InlineCamera';
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
  };

  const canStartAssessment = stream && Object.values(systemStatus).some(status => status);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header timeLeft={formattedTime} />

      <div className="flex-1 max-w-4xl mx-auto p-6 w-full">
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System checks</h2>
          
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
                <InlineCamera
                  isDetecting={isDetecting}
                  isModelLoading={isModelLoading}
                  error={error}
                  detectedObjects={detectedObjects}
                  startDetection={startDetection}
                  stopDetection={stopDetection}
                />
              )}
            </div>

            {/* System Status Grid */}
            <SystemStatusGrid 
              systemStatus={systemStatus} 
              hasBeenChecked={hasBeenChecked} 
            />
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