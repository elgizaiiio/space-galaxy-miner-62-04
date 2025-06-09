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
import { getTranslation } from '@/utils/language';

interface MiningPageProps {
  initialMiningSpeed?: number;
}

const MiningPage = () => {
  const [spaceCoins, setSpaceCoins] = useState(0);
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0.1);
  const [miningActive, setMiningActive] = useState(false);
  const [autoMiningActive, setAutoMiningActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300);
  const [autoMiningRemainingTime, setAutoMiningRemainingTime] = useState(3600);
  const { toast } = useToast();

  const t = (key: string) => getTranslation(key);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              $SPACE Mining
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">
              Mine $SPACE, upgrade your speed, and invite friends for bonuses!
            </p>
          </div>
        </div>

        {/* Mining Circle */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-80 h-80">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-2xl animate-pulse"></div>
            
            {/* Main circle */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border-4 border-gradient-to-r border-blue-400/50 shadow-2xl overflow-hidden">
              {/* Inner glow effect */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-xl"></div>
              
              {/* SPACE AI Logo in center - Clean logo without text overlays */}
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-xl border border-blue-400/20 rounded-3xl p-6 shadow-2xl">
            {/* Mining Status Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                {miningActive || autoMiningActive ? (
                  <>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 font-semibold text-lg">
                      {autoMiningActive ? 'Auto Mining' : 'Mining'}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-400 font-semibold text-lg">Mining Stopped</span>
                  </>
                )}
              </div>
            </div>

            {/* Mining Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Balance */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/70 text-sm">Balance</span>
                </div>
                <div className="text-white font-bold text-xl">
                  {spaceCoins.toLocaleString()}
                </div>
                <div className="text-blue-300 text-sm">$SPACE</div>
              </div>

              {/* Mining Speed */}
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/70 text-sm">Speed</span>
                </div>
                <div className="text-white font-bold text-xl">
                  {miningSpeed}x
                </div>
                <div className="text-purple-300 text-sm">Multiplier</div>
              </div>

              {/* Time Remaining */}
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-4 border border-green-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/70 text-sm">Time Left</span>
                </div>
                <div className="text-white font-bold text-xl">
                  {formatTime(autoMiningActive ? autoMiningRemainingTime : remainingTime)}
                </div>
                <div className="text-green-300 text-sm">Remaining</div>
              </div>

              {/* Earnings Per Hour */}
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-4 border border-orange-400/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/70 text-sm">Per Hour</span>
                </div>
                <div className="text-white font-bold text-xl">
                  {(coinsPerSecond * 3600).toLocaleString()}
                </div>
                <div className="text-orange-300 text-sm">$SPACE</div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleStartMining}
              disabled={miningActive || autoMiningActive}
              className={`w-full py-4 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg ${
                miningActive || autoMiningActive
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                {miningActive || autoMiningActive ? (
                  <>
                    <Pause className="w-6 h-6" />
                    <span>Stop Mining</span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    <span>Start Mining</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        </motion.div>

        {/* Upgrades Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">
            {t('upgrades')}
          </h2>
          <p className="text-gray-300 text-center">
            {t('upgradeMiningSpeed')}
          </p>
          {/* Upgrade Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Example Upgrade Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-xl border border-blue-400/20 rounded-3xl p-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {t('basicUpgrade')}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {t('increaseMiningSpeed')}
                  </p>
                </div>
                <div className="text-yellow-400 text-xl font-bold">
                  10 TON
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl">
                {t('upgradeNow')}
              </Button>
            </motion.div>
            {/* Add more upgrade cards here */}
          </div>
        </div>

        {/* Notification Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 p-4 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-400/20 rounded-3xl shadow-2xl text-center"
        >
          <h2 className="text-xl font-bold text-white mb-2">
            {t('stayUpdated')}
          </h2>
          <p className="text-gray-300">
            {t('enableNotifications')}
          </p>
          <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-2xl">
            {t('enableNow')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MiningPage;
