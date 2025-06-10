
import React, { useState, useEffect } from 'react';
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

const MiningPage = () => {
  const [spaceCoins, setSpaceCoins] = useState(0);
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0.1);
  const [miningActive, setMiningActive] = useState(false);
  const [autoMiningActive, setAutoMiningActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(28800); // 8 hours
  const [autoMiningRemainingTime, setAutoMiningRemainingTime] = useState(28800); // 8 hours
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
      setRemainingTime(28800); // 8 hours
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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

        {/* Mining Circle - Glowing Logo */}
        <div className="relative flex justify-center items-center mb-4">
          <div className="relative w-32 h-32">
            <div className="relative w-full h-full overflow-hidden">
              <div className="w-full h-full z-10 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/d391ae90-26f4-41e1-b5c8-5451cc3c1664.png" 
                  alt="SPACE AI Logo"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    miningActive || autoMiningActive 
                      ? 'drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] animate-pulse' 
                      : ''
                  }`}
                  style={{
                    filter: miningActive || autoMiningActive 
                      ? 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.6)) drop-shadow(0 0 60px rgba(236, 72, 153, 0.4))'
                      : 'none'
                  }}
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
