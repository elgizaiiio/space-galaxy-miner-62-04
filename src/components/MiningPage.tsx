"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play,
} from 'lucide-react';
import { useSpaceCoins } from '../hooks/useSpaceCoins';

const MiningPage = () => {
  const { spaceCoins, addCoins } = useSpaceCoins();
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0.1);
  const [miningActive, setMiningActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(28800); // 8 hours
  const [username, setUsername] = useState('');
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  // Prevent scrolling when component loads
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  // Load saved data on component mount
  useEffect(() => {
    // Load username
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Load mining speed
    const storedMiningSpeed = localStorage.getItem('miningSpeed');
    if (storedMiningSpeed) {
      setMiningSpeed(parseFloat(storedMiningSpeed));
    }

    // Check if mining was active and restore state
    const miningStartTime = localStorage.getItem('miningStartTime');
    const miningDuration = localStorage.getItem('miningDuration');
    const wasMiningActive = localStorage.getItem('miningActive') === 'true';
    
    if (wasMiningActive && miningStartTime && miningDuration) {
      const startTime = parseInt(miningStartTime);
      const duration = parseInt(miningDuration);
      const currentTime = Date.now();
      const elapsedTimeMs = currentTime - startTime;
      const elapsedTimeSeconds = Math.floor(elapsedTimeMs / 1000);
      
      console.log('Restoring mining state:', {
        startTime: new Date(startTime),
        currentTime: new Date(currentTime),
        elapsedTimeSeconds,
        duration,
        wasMiningActive
      });
      
      if (elapsedTimeSeconds < duration) {
        // Mining is still active
        setMiningActive(true);
        setRemainingTime(duration - elapsedTimeSeconds);
        setLastUpdateTime(currentTime);
        
        // Calculate coins earned while away
        const currentMiningSpeed = storedMiningSpeed ? parseFloat(storedMiningSpeed) : 1;
        const baseCoinsPerSecond = 0.1;
        const coinsEarned = Math.floor(elapsedTimeSeconds * (baseCoinsPerSecond * currentMiningSpeed) * 100) / 100;
        
        console.log('Adding coins from offline mining:', coinsEarned);
        
        if (coinsEarned > 0) {
          addCoins(coinsEarned);
        }
      } else {
        // Mining session completed while away
        console.log('Mining session completed while away');
        setMiningActive(false);
        setRemainingTime(28800);
        
        // Add coins from completed session
        const currentMiningSpeed = storedMiningSpeed ? parseFloat(storedMiningSpeed) : 1;
        const baseCoinsPerSecond = 0.1;
        const totalCoinsEarned = Math.floor(duration * (baseCoinsPerSecond * currentMiningSpeed) * 100) / 100;
        
        console.log('Adding coins from completed session:', totalCoinsEarned);
        
        if (totalCoinsEarned > 0) {
          addCoins(totalCoinsEarned);
        }
        
        // Clear mining data
        localStorage.removeItem('miningStartTime');
        localStorage.removeItem('miningDuration');
        localStorage.setItem('miningActive', 'false');
      }
    }
  }, [addCoins]);

  // Update coins per second when mining speed changes
  useEffect(() => {
    localStorage.setItem('miningSpeed', miningSpeed.toString());
    setCoinsPerSecond(0.1 * miningSpeed);
  }, [miningSpeed]);

  // Save mining state whenever it changes
  useEffect(() => {
    localStorage.setItem('miningActive', miningActive.toString());
  }, [miningActive]);

  // Mining interval for active mining
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (miningActive) {
      // Update every 5 seconds for more responsive mining
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const timeDiff = (currentTime - lastUpdateTime) / 1000; // seconds
        
        // Add coins based on actual time passed
        const coinsToAdd = Math.floor((coinsPerSecond * timeDiff) * 100) / 100;
        
        console.log('Mining update:', {
          timeDiff,
          coinsPerSecond,
          coinsToAdd,
          remainingTime
        });
        
        if (coinsToAdd > 0) {
          addCoins(coinsToAdd);
        }
        
        setLastUpdateTime(currentTime);
        
        setRemainingTime((prevTime) => {
          const newTime = prevTime - Math.floor(timeDiff);
          if (newTime <= 0) {
            console.log('Mining session completed');
            setMiningActive(false);
            localStorage.removeItem('miningStartTime');
            localStorage.removeItem('miningDuration');
            localStorage.setItem('miningActive', 'false');
            return 0;
          }
          return newTime;
        });
      }, 5000); // Update every 5 seconds
    }

    return () => clearInterval(intervalId);
  }, [miningActive, coinsPerSecond, addCoins, lastUpdateTime]);

  const handleStartMining = () => {
    if (!miningActive) {
      // Start mining
      const currentTime = Date.now();
      const duration = 28800; // 8 hours in seconds
      
      console.log('Starting mining session');
      
      localStorage.setItem('miningStartTime', currentTime.toString());
      localStorage.setItem('miningDuration', duration.toString());
      localStorage.setItem('miningActive', 'true');
      
      setMiningActive(true);
      setRemainingTime(duration);
      setLastUpdateTime(currentTime);
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

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
            <p className="text-white text-lg">Mining Time Left:</p>
            <p className="text-white text-xl font-bold">{formatTime(remainingTime)}</p>
          </div>
        )}

        {/* Mining Button - Only show Start Mining button when not mining */}
        {!miningActive && (
          <div className="flex justify-center">
            <Button
              onClick={handleStartMining}
              className="py-4 px-8 text-lg font-bold rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <div className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                <span>Start Mining</span>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiningPage;
