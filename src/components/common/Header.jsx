import React from 'react';
import { Clock } from 'lucide-react';
import { ASSESSMENT_TITLE, ASSESSMENT_SUBTITLE } from '../../utils/constants';
import logo from '../../assets/images/logo.png'

const Header = ({ timeLeft }) => (
  <div className="bg-white shadow-sm border-b p-4">
    <div className="max-w-4xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div style={{ backgroundColor: 'var(--color-primary)' }} className="w-12 h-12 rounded-lg flex items-center justify-center px-2">
          <img src={logo} alt="Logo" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">{ASSESSMENT_TITLE}</h1>
          <p className="text-sm text-gray-500">{ASSESSMENT_SUBTITLE}</p>
        </div>
      </div>
      
      <div style={{ backgroundColor: 'var(--color-primary-bg)', borderRadius: 'var(--border-primary)' }} className="flex items-center space-x-2 text-purple-600 py-3 px-3">
        <Clock style={{ color: 'var(--color-primary-light)' }} className="w-5 h-5" />
        <span className="font-medium" style={{ color: 'var(--color-primary-light)' }}>{timeLeft} time left</span>
      </div>
    </div>
  </div>
);

export default Header;
  