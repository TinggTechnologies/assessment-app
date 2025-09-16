import React from "react";
import { Check, AlertTriangle } from 'lucide-react';

const SystemStatusItem = ({ icon: Icon, label, status, hasBeenChecked }) => {

  const getStatusIndicator = () => {
    if (!hasBeenChecked) {

      return (
        <div 
          className="w-4 h-4 rounded-full" 
          style={{position: 'absolute', top: 8, right: 8, backgroundColor: 'var(--color-primary-light)'}} 
        />
      );
    }
  
    if (status) {
      return (
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center" 
          style={{position: 'absolute', top: 6, right: 6, backgroundColor: 'var(--color-primary-light)'}}
        >
          <Check className="w-3 h-3 text-white" />
        </div>
      );
    } else {
      return (
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center" 
          style={{position: 'absolute', top: 6, right: 6, backgroundColor: 'var(--color-danger)'}}
        >
          <AlertTriangle className="w-3 h-3 text-white" />
        </div>
      );
    }
  };

  const getIconColor = () => {
    if (!hasBeenChecked) {
      return 'var(--color-primary-light)'; 
    }
    return status ? 'var(--color-primary-light)' : 'var(--color-danger)'; 
  };

  return (
    <div 
      className="flex flex-col items-center p-4 rounded-lg" 
      style={{
        position: 'relative', 
        backgroundColor: 'var(--color-secondary-bg)' 
      }}
    >
      <div 
        className="p-3 rounded-full mb-3" 
        style={{backgroundColor: 'var(--color-tertiary-bg)'}} 
      >
        <Icon 
          className="w-5 h-5" 
          style={{color: getIconColor()}} 
        />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {getStatusIndicator()}
    </div>
  );
};

export default SystemStatusItem;