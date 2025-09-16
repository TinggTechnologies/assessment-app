import React from 'react';

const StartAssessmentModal = ({ isOpen, onClose, onProceed }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 poppins-regular">
      <div className="rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center pb-4 p-6" style={{backgroundColor: 'var(--color-primary-light)', borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
          <h3 className="text-lg font-semibold text-white">Start assessment</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className='text-white'>Close</span>
          </button>
        </div>
        
        <div className="text-center p-6" style={{backgroundColor: 'var(--color-secondary-bg)'}}>
          <h4 className="text-xl font-semibold mb-3" style={{color: 'var(--color-primary-light)'}}>
            Proceed to start assessment
          </h4>
          <p className="text-gray-600 leading-relaxed">
            Kindly keep to the rules of the assessment and sit up, stay in front of your camera/webcam and start your assessment.
          </p>
        </div>
        
        <div className='bg-white pt-3' style={{position: "relative", marginTop: -12, height: '5rem', borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
        <button
          onClick={onProceed}
          className="text-white py-3 px-10 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          style={{backgroundColor: 'var(--color-primary-light)', position: 'absolute', right: 10,}}
        >
          Proceed
        </button>
        </div>
      </div>
    </div>
  );
};

export default StartAssessmentModal;