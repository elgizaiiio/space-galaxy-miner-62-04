
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showFadeOut, setShowFadeOut] = useState(false);

  useEffect(() => {
    // Auto complete after 3 seconds
    const timer = setTimeout(() => {
      handleComplete();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleComplete = () => {
    setShowFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 cursor-pointer ${
        showFadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleComplete}
    >
      {/* Background Image - Full Screen Coverage */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/1c20bfb0-8100-4238-a6e3-a631e16cae93.png')`
        }}
      />

      {/* Centered loading indicator and welcome text */}
      <div className="flex flex-col items-center justify-center">
        {/* Loading spinner */}
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
        
        {/* Welcome text */}
        <p className="text-white text-sm font-medium tracking-wide">Welcome</p>
      </div>
    </div>
  );
};

export default SplashScreen;
