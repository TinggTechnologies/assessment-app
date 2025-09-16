import React, { useRef, useEffect } from 'react';

const DetectionCanvas = ({ videoRef, detectedObjects }) => {
  const canvasRef = useRef(null);

  const drawBoundingBoxes = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video || !detectedObjects.length) return;
    
    const ctx = canvas.getContext('2d');
    const { videoWidth, videoHeight } = video;
    const { offsetWidth, offsetHeight } = canvas;
    
    canvas.width = offsetWidth;
    canvas.height = offsetHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const scaleX = offsetWidth / videoWidth;
    const scaleY = offsetHeight / videoHeight;
    
    detectedObjects.forEach((obj) => {
      const x = obj.x * scaleX;
      const y = obj.y * scaleY;
      const width = obj.width * scaleX;
      const height = obj.height * scaleY;
      
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      const label = `${obj.name} ${Math.round(obj.confidence * 100)}%`;
      ctx.font = '14px Arial';
      const textWidth = ctx.measureText(label).width;
      const textHeight = 20;
      
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x, y - textHeight, textWidth + 8, textHeight);
      
      ctx.fillStyle = 'white';
      ctx.fillText(label, x + 4, y - 4);
    });
  };

  useEffect(() => {
    if (detectedObjects.length > 0) {
      drawBoundingBoxes();
    } else if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [detectedObjects]);

  useEffect(() => {
    const handleResize = () => {
      if (detectedObjects.length > 0) {
        setTimeout(drawBoundingBoxes, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [detectedObjects]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

export default DetectionCanvas;