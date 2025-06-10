import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { 
  Coins, 
  Zap, 
  Clock, 
  TrendingUp, 
  Play,
} from 'lucide-react';

interface MiningPageProps {
  initialMiningSpeed?: number;
}

const StarField = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            background: `linear-gradient(45deg, #ffffff, #ec4899, #8b5cf6)`,
            borderRadius: '50%',
            animation: `sparkle-${i % 4} ${Math.random() * 4 + 3}s ease-in-out infinite`,
            filter: `hue-rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>
        {`
          @keyframes sparkle-0 {
            0%, 100% { opacity: 0.2; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.5); }
          }
          @keyframes sparkle-1 {
            0%, 100% { opacity: 0.4; transform: scale(0.8); }
            25% { opacity: 0.9; transform: scale(1.2); }
            75% { opacity: 0.3; transform: scale(0.6); }
          }
          @keyframes sparkle-2 {
            0%, 100% { opacity: 0.3; transform: scale(0.7); }
            33% { opacity: 1; transform: scale(1.4); }
            66% { opacity: 0.5; transform: scale(1); }
          }
          @keyframes sparkle-3 {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            40% { opacity: 0.8; transform: scale(1.3); }
            80% { opacity: 0.2; transform: scale(0.4); }
          }
        `}
      </style>
    </div>
  );
};

const MiningPage = () => {
  const [spaceCoins, setSpaceCoins] = useState(0);
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0.1);
  const [miningActive, setMiningActive] = useState(false);
  const [autoMiningActive, setAutoMiningActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300);
  const [autoMiningRemainingTime, setAutoMiningRemainingTime] = useState(3600);
  const { toast } = useToast();

  useEffect(() => {
    const storedCoins = localStorage.getItem('spaceCoins');
    if (storedCoins) {
      setSpaceCoins(parseFloat(storedCoins));
    }

    const storedMiningSpeed = localStorage.getItem('miningSpeed');
    if (storedMiningSpeed) {
      setMiningSpeed(parseFloat(storedMiningSpeed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('spaceCoins', spaceCoins.toString());
  }, [spaceCoins]);

  useEffect(() => {
    localStorage.setItem('miningSpeed', miningSpeed.toString());
    setCoinsPerSecond(0.1 * miningSpeed);
  }, [miningSpeed]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (miningActive) {
      intervalId = setInterval(() => {
        setSpaceCoins((prevCoins) => prevCoins + coinsPerSecond);
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            setMiningActive(false);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [miningActive, coinsPerSecond]);

  useEffect(() => {
    let autoMiningIntervalId: NodeJS.Timeout;

    if (autoMiningActive) {
      autoMiningIntervalId = setInterval(() => {
        setSpaceCoins((prevCoins) => prevCoins + coinsPerSecond);
        setAutoMiningRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            setAutoMiningActive(false);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(autoMiningIntervalId);
  }, [autoMiningActive, coinsPerSecond]);

  const handleStartMining = () => {
    if (miningActive || autoMiningActive) {
      setMiningActive(false);
      setAutoMiningActive(false);
    } else {
      setMiningActive(true);
      setRemainingTime(300);
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="min-h-screen relative p-2 pb-20 overflow-hidden">
      {/* Background Image - Full Screen Coverage */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/e80a217f-cec9-4e53-bb98-cb1000455827.png')`
        }}
      />
      
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-black/30" />
      
      <StarField />
      
      <div className="max-w-xs mx-auto space-y-3 relative z-10">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
            $SPACE Mining
          </h1>
          <p className="text-gray-200 text-xs px-2 leading-relaxed">
            Mine $SPACE coins and upgrade your mining speed to earn more rewards
          </p>
        </div>

        {/* Enhanced Compact Mining Status */}
        {(miningActive || autoMiningActive) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative mb-3"
          >
            <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-600/20 backdrop-blur-xl border border-green-400/50 rounded-xl p-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/70"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-40"></div>
                  </div>
                  <span className="text-green-300 font-bold text-sm">
                    {autoMiningActive ? 'Auto Mining' : 'Mining Active'}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-green-200 text-xs font-medium">
                    {formatTime(autoMiningActive ? autoMiningRemainingTime : remainingTime)}
                  </div>
                  <div className="text-green-400 text-xs">
                    +{coinsPerSecond.toFixed(1)}/sec
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-2">
                <div className="w-full bg-green-900/30 rounded-full h-1.5">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${((autoMiningActive ? (3600 - autoMiningRemainingTime) / 3600 : (300 - remainingTime) / 300) * 100)}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-green-400 rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: '50%',
                  }}
                  animate={{
                    y: [-10, -30, -10],
                    opacity: [0.8, 0.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.7,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Mining Circle - Clean Logo */}
        <div className="relative flex justify-center items-center mb-4">
          <div className="relative w-32 h-32">
            <div className="relative w-full h-full overflow-hidden">
              <div className="w-full h-full z-10 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/d391ae90-26f4-41e1-b5c8-5451cc3c1664.png" 
                  alt="SPACE AI Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mining Information Panel */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="bg-gradient-to-br from-slate-800/50 via-blue-900/40 to-purple-900/50 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-3 shadow-xl"
        >
          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {/* Balance */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-2 border border-blue-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-1">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span className="text-white/80 text-xs font-medium">Balance</span>
              </div>
              <div className="text-white font-bold text-sm">
                {spaceCoins.toLocaleString()}
              </div>
              <div className="text-blue-300 text-xs">$SPACE</div>
            </div>

            {/* Mining Speed */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-2 border border-purple-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-white/80 text-xs font-medium">Speed</span>
              </div>
              <div className="text-white font-bold text-sm">
                {miningSpeed}x
              </div>
              <div className="text-purple-300 text-xs">Multiplier</div>
            </div>

            {/* Time Remaining */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-2 border border-green-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-yellow-400" />
                <span className="text-white/80 text-xs font-medium">Time Left</span>
              </div>
              <div className="text-white font-bold text-sm">
                {formatTime(autoMiningActive ? autoMiningRemainingTime : remainingTime)}
              </div>
              <div className="text-green-300 text-xs">Remaining</div>
            </div>

            {/* Earnings Per Hour */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-2 border border-orange-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-yellow-400" />
                <span className="text-white/80 text-xs font-medium">Per Hour</span>
              </div>
              <div className="text-white font-bold text-sm">
                {(coinsPerSecond * 3600).toLocaleString()}
              </div>
              <div className="text-orange-300 text-xs">$SPACE</div>
            </div>
          </div>

          {/* Enhanced Action Button - Only show Start Mining */}
          {!miningActive && !autoMiningActive && (
            <Button
              onClick={handleStartMining}
              className="w-full py-2 text-sm font-bold rounded-xl transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/30"
            >
              <div className="flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                <span>Start Mining</span>
              </div>
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MiningPage;
