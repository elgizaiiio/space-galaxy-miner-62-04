
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useSpaceCoins } from '../hooks/useSpaceCoins';

const MiningPage = () => {
  const { spaceCoins, addCoins } = useSpaceCoins();
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0.1);
  const [miningActive, setMiningActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(28800); // 8 hours
  const [username, setUsername] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  // Memoized coin adding function to prevent unnecessary re-renders
  const addCoinsStable = useCallback((amount: number) => {
    addCoins(amount);
  }, [addCoins]);

  // Prevent scrolling when component loads
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  // Initialize component data once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    console.log('Initializing mining page...');

    // Load username
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Load mining speed
    const storedMiningSpeed = localStorage.getItem('miningSpeed');
    const currentMiningSpeed = storedMiningSpeed ? parseFloat(storedMiningSpeed) : 1;
    setMiningSpeed(currentMiningSpeed);
    setCoinsPerSecond(0.1 * currentMiningSpeed);

    // Restore mining state
    restoreMiningState(currentMiningSpeed);
  }, []);

  const restoreMiningState = (currentMiningSpeed: number) => {
    const miningStartTime = localStorage.getItem('miningStartTime');
    const miningDuration = localStorage.getItem('miningDuration');
    const wasMiningActive = localStorage.getItem('miningActive') === 'true';
    
    console.log('Restoring mining state:', {
      wasMiningActive,
      miningStartTime,
      miningDuration
    });
    
    if (wasMiningActive && miningStartTime && miningDuration) {
      const startTime = parseInt(miningStartTime);
      const duration = parseInt(miningDuration);
      const currentTime = Date.now();
      const elapsedTimeMs = currentTime - startTime;
      const elapsedTimeSeconds = Math.floor(elapsedTimeMs / 1000);
      
      console.log('Mining restoration details:', {
        startTime: new Date(startTime).toLocaleString(),
        currentTime: new Date(currentTime).toLocaleString(),
        elapsedTimeSeconds,
        duration
      });
      
      if (elapsedTimeSeconds < duration && elapsedTimeSeconds >= 0) {
        // Mining is still active
        const newRemainingTime = Math.max(0, duration - elapsedTimeSeconds);
        setMiningActive(true);
        setRemainingTime(newRemainingTime);
        
        // Calculate coins earned while away
        const baseCoinsPerSecond = 0.1;
        const coinsEarned = Math.round(elapsedTimeSeconds * (baseCoinsPerSecond * currentMiningSpeed) * 100) / 100;
        
        console.log('Adding offline mining coins:', coinsEarned);
        
        if (coinsEarned > 0) {
          addCoinsStable(coinsEarned);
        }
      } else if (elapsedTimeSeconds >= duration) {
        // Mining session completed while away
        console.log('Mining session completed while offline');
        completeMiningSession(duration, currentMiningSpeed);
      } else {
        // Invalid state, reset
        resetMiningState();
      }
    }
  };

  const completeMiningSession = (duration: number, currentMiningSpeed: number) => {
    setMiningActive(false);
    setRemainingTime(28800);
    
    // Add coins from completed session
    const baseCoinsPerSecond = 0.1;
    const totalCoinsEarned = Math.round(duration * (baseCoinsPerSecond * currentMiningSpeed) * 100) / 100;
    
    console.log('Adding coins from completed session:', totalCoinsEarned);
    
    if (totalCoinsEarned > 0) {
      addCoinsStable(totalCoinsEarned);
    }
    
    resetMiningState();
  };

  const resetMiningState = () => {
    localStorage.removeItem('miningStartTime');
    localStorage.removeItem('miningDuration');
    localStorage.setItem('miningActive', 'false');
  };

  // Handle mining interval - Fixed to prevent infinite loop
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only start interval if mining is active and there's time remaining
    if (miningActive && remainingTime > 0) {
      console.log('Starting mining interval');
      
      intervalRef.current = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = Math.max(0, prevTime - 1);
          
          if (newTime <= 0) {
            console.log('Mining session completed');
            setMiningActive(false);
            resetMiningState();
            return 0;
          }
          
          return newTime;
        });

        // Add coins with stable reference
        const coinsToAdd = Math.round(coinsPerSecond * 100) / 100;
        if (coinsToAdd > 0) {
          addCoinsStable(coinsToAdd);
        }
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [miningActive, remainingTime, coinsPerSecond, addCoinsStable]);

  // Save mining speed when it changes
  useEffect(() => {
    if (miningSpeed > 0) {
      localStorage.setItem('miningSpeed', miningSpeed.toString());
      setCoinsPerSecond(0.1 * miningSpeed);
    }
  }, [miningSpeed]);

  // Save mining state when it changes
  useEffect(() => {
    localStorage.setItem('miningActive', miningActive.toString());
  }, [miningActive]);

  const handleStartMining = () => {
    if (!miningActive && remainingTime > 0) {
      const currentTime = Date.now();
      const duration = 28800; // 8 hours in seconds
      
      console.log('Starting mining session');
      
      // Save mining state
      localStorage.setItem('miningStartTime', currentTime.toString());
      localStorage.setItem('miningDuration', duration.toString());
      localStorage.setItem('miningActive', 'true');
      
      setMiningActive(true);
      setRemainingTime(duration);
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Handle page visibility change to save state
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && miningActive) {
        // Save current state when page becomes hidden
        const currentTime = Date.now();
        localStorage.setItem('miningLastSeen', currentTime.toString());
        console.log('Saving mining state when page hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [miningActive]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background Image - Full Screen Coverage */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/836a3d93-ee4f-4c26-9fd4-cf95f416631c.png')`
        }}
      />
      
      {/* Content positioned at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-6 pb-20 flex flex-col items-center">
        {/* Username with Matrix-style font */}
        {username && (
          <div className="text-center mb-4">
            <p className="text-white text-2xl font-bold font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {username}
            </p>
          </div>
        )}

        {/* Balance */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="/lovable-uploads/46b9f7e6-4f32-4240-9fc4-16d1bcdec0d0.png" 
              alt="Space Coin"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white text-3xl font-bold">
            {Math.floor(spaceCoins).toLocaleString()}
          </span>
        </div>

        {/* Mining Rate Display */}
        {miningActive && (
          <div className="text-center mb-2">
            <p className="text-green-400 text-sm">
              Mining: {(coinsPerSecond * 3600).toFixed(2)} coins/hour
            </p>
          </div>
        )}

        {/* Mining Time Display - Only show when mining is active */}
        {miningActive && (
          <div className="text-center mb-4">
            <p className="text-white text-lg">Mining time remaining:</p>
            <p className="text-white text-xl font-bold">{formatTime(remainingTime)}</p>
          </div>
        )}

        {/* Mining Button - Only show Start Mining button when not mining */}
        {!miningActive && (
          <div className="flex justify-center">
            <Button
              onClick={handleStartMining}
              disabled={remainingTime <= 0}
              className="py-4 px-8 text-lg font-bold rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                <span>Start Mining</span>
              </div>
            </Button>
          </div>
        )}

        {/* Debug info (will be removed in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-white text-xs mt-4 text-center opacity-50">
            <p>Mining Status: {miningActive ? 'Active' : 'Inactive'}</p>
            <p>Remaining Time: {remainingTime}s</p>
            <p>Mining Speed: {miningSpeed}x</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiningPage;
