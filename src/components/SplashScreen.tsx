
import React, { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Central content */}
      <div className="relative z-10 text-center">
        {/* Animated logo */}
        <div className="mb-8 animate-bounce">
          <img 
            src="/lovable-uploads/be8f1a36-1907-4464-9c19-754c1d78354a.png" 
            alt="SPACE Coin"
            className="w-24 h-24 mx-auto rounded-full shadow-2xl animate-spin"
            style={{ animationDuration: '3s' }}
          />
        </div>

        {/* Title with glow effect */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 animate-pulse">
          $SPACE
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-lg mb-8 animate-fade-in">
          Mine the Galaxy
        </p>

        {/* Loading animation */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Progress text */}
        <p className="text-white/60 text-sm mt-4 animate-pulse">
          Connecting to the galaxy...
        </p>
      </div>

      {/* Orbital rings animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute w-72 h-72 border border-blue-400/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        <div className="absolute w-48 h-48 border border-purple-400/20 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
      </div>
    </div>
  );
};

export default SplashScreen;
