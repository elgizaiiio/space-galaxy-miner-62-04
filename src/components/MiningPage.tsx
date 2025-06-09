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
  Pause,
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
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 1.5 + 0.5}px`,
            height: `${Math.random() * 1.5 + 0.5}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 1}s`,
            boxShadow: `0 0 ${Math.random() * 4 + 2}px rgba(255, 255, 255, 0.3)`,
          }}
        />
      ))}
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
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat scale-90"
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

        {/* Mining Circle */}
        <div className="relative flex justify-center items-center mb-4">
          <div className="relative w-40 h-40">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-lg animate-pulse"></div>
            
            {/* Main circle with no border */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg shadow-xl overflow-hidden">
              {/* SPACE AI Logo in center - no borders or padding */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/d391ae90-26f4-41e1-b5c8-5451cc3c1664.png" 
                  alt="SPACE AI Logo"
                  className="w-full h-full object-cover rounded-full"
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
          {/* Mining Status */}
          <div className="text-center mb-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              {miningActive || autoMiningActive ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-400/50"></div>
                  <span className="text-green-400 font-semibold text-sm">
                    {autoMiningActive ? 'Auto Mining Active' : 'Mining Active'}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-300 font-semibold text-sm">Mining Stopped</span>
                </>
              )}
            </div>
          </div>

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

          {/* Enhanced Action Button */}
          <Button
            onClick={handleStartMining}
            disabled={miningActive || autoMiningActive}
            className={`w-full py-2 text-sm font-bold rounded-xl transition-all duration-300 shadow-lg ${
              miningActive || autoMiningActive
                ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-red-500/30'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/30'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {miningActive || autoMiningActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Stop Mining</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Mining</span>
                </>
              )}
            </div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MiningPage;
