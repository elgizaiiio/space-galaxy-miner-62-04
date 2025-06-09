
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
      {[...Array(150)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 1}s`,
            boxShadow: `0 0 ${Math.random() * 8 + 3}px rgba(255, 255, 255, 0.6)`,
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
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/e80a217f-cec9-4e53-bb98-cb1000455827.png')`
        }}
      />
      
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-black/30" />
      
      <StarField />
      
      <div className="max-w-sm mx-auto space-y-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            $SPACE Mining
          </h1>
          <p className="text-gray-200 text-sm px-4 leading-relaxed">
            Mine $SPACE coins and upgrade your mining speed to earn more rewards
          </p>
        </div>

        {/* Mining Circle */}
        <div className="relative flex justify-center items-center mb-6">
          <div className="relative w-52 h-52">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-xl animate-pulse"></div>
            
            {/* Main circle with improved styling */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* SPACE AI Logo in center - removed borders */}
              <div className="absolute inset-0 z-10 flex items-center justify-center p-2">
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
          className="bg-gradient-to-br from-slate-800/50 via-blue-900/40 to-purple-900/50 backdrop-blur-xl border border-blue-400/30 rounded-3xl p-4 shadow-2xl"
        >
          {/* Mining Status */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              {miningActive || autoMiningActive ? (
                <>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-green-400 font-semibold text-base">
                    {autoMiningActive ? 'Auto Mining Active' : 'Mining Active'}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-300 font-semibold text-base">Mining Stopped</span>
                </>
              )}
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Balance */}
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-3 border border-blue-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-white/80 text-sm font-medium">Balance</span>
              </div>
              <div className="text-white font-bold text-lg">
                {spaceCoins.toLocaleString()}
              </div>
              <div className="text-blue-300 text-sm">$SPACE</div>
            </div>

            {/* Mining Speed */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-3 border border-purple-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white/80 text-sm font-medium">Speed</span>
              </div>
              <div className="text-white font-bold text-lg">
                {miningSpeed}x
              </div>
              <div className="text-purple-300 text-sm">Multiplier</div>
            </div>

            {/* Time Remaining */}
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-3 border border-green-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-white/80 text-sm font-medium">Time Left</span>
              </div>
              <div className="text-white font-bold text-lg">
                {formatTime(autoMiningActive ? autoMiningRemainingTime : remainingTime)}
              </div>
              <div className="text-green-300 text-sm">Remaining</div>
            </div>

            {/* Earnings Per Hour */}
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-3 border border-orange-400/30 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="text-white/80 text-sm font-medium">Per Hour</span>
              </div>
              <div className="text-white font-bold text-lg">
                {(coinsPerSecond * 3600).toLocaleString()}
              </div>
              <div className="text-orange-300 text-sm">$SPACE</div>
            </div>
          </div>

          {/* Enhanced Action Button */}
          <Button
            onClick={handleStartMining}
            disabled={miningActive || autoMiningActive}
            className={`w-full py-3 text-base font-bold rounded-2xl transition-all duration-300 shadow-xl ${
              miningActive || autoMiningActive
                ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-red-500/30'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/30'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              {miningActive || autoMiningActive ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Stop Mining</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
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
