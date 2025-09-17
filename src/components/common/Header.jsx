import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ASSESSMENT_TITLE, ASSESSMENT_SUBTITLE } from '../../utils/constants';
import logo from '../../assets/images/logo.png';
import timer from '../../assets/images/timer-start.png'

const Header = ({ timeLeft }) => {
  const [showTime, setShowTime] = useState(true);

  const toggleTimeVisibility = () => {
    setShowTime(!showTime);
  };

  return (
    <div className="bg-white shadow-sm border-b p-4 poppins-regular">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div style={{ backgroundColor: 'var(--color-primary)' }} className="w-12 h-12 rounded-lg flex items-center justify-center px-2">
            <img src={logo} alt="Logo" />
          </div>
          <div>
            <h1 className="text-lg font-semibold poppins-regular">{ASSESSMENT_TITLE}</h1>
            <p className="text-sm poppins-regular">{ASSESSMENT_SUBTITLE}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div 
            style={{ 
              backgroundColor: 'var(--color-primary-bg)', 
              borderRadius: 'var(--border-primary)' 
            }} 
            className="flex items-center space-x-2 text-purple-600 py-3 px-3"
          >
            <img src={timer} alt="Logo" className="w-5 h-5" />
            {showTime && (
              <span className="font-medium" style={{ color: 'var(--color-primary-light)' }}>
                {timeLeft} time left
              </span>
            )}
          </div>
          
          <div className='p-1' style={{ 
              backgroundColor: 'var(--color-primary-bg)', 
              borderRadius: 'var(--border-primary)' 
            }} >
          <button
            onClick={toggleTimeVisibility}
            className="p-2 rounded-full transition-colors"
            aria-label={showTime ? "Hide time" : "Show time"}
          >
            {showTime ? (
              <Eye className="w-5 h-5" style={{ color: 'var(--color-primary-light)' }} />
            ) : (
              <EyeOff className="w-5 h-5" style={{ color: 'var(--color-primary-light)' }} />
            )}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;