
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showFadeOut, setShowFadeOut] = useState(false);

  useEffect(() => {
    // Auto complete after video duration or 5 seconds max
    const timer = setTimeout(() => {
      handleComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    setShowFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleVideoEnded = () => {
    handleComplete();
  };

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
        showFadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleComplete}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Video Player */}
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          onLoadedData={handleVideoLoad}
          poster="/lovable-uploads/a61fe220-a4a1-4863-bf49-f46aaea61a74.png"
        >
          <source 
            src="https://cdn.kapwing.com/final_6847b1c31d08ff56e3259475_289133.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Loading indicator while video loads */}
        {!videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-lg">Loading...</p>
            </div>
          </div>
        )}

        {/* Skip button */}
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm hover:bg-black/70 transition-colors"
        >
          Skip
        </button>

        {/* Tap to continue hint */}
        {videoLoaded && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center animate-pulse">
            <p className="text-sm opacity-75">Tap anywhere to continue</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
