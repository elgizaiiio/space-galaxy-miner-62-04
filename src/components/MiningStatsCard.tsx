
import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Coins, Zap, Timer, Crown } from 'lucide-react';
import { getTranslation } from '../utils/language';

interface MiningStatsCardProps {
  spaceCoins: number;
  miningSpeed: number;
  autoMiningActive: boolean;
  autoMiningRemainingTime: number;
  miningActive: boolean;
  remainingTime: number;
  currentLanguage: { code: string };
  formatTime: (milliseconds: number) => string;
}

const MiningStatsCard: React.FC<MiningStatsCardProps> = ({
  spaceCoins,
  miningSpeed,
  autoMiningActive,
  autoMiningRemainingTime,
  miningActive,
  remainingTime,
  currentLanguage,
  formatTime
}) => {
  const t = (key: string) => getTranslation(key, currentLanguage.code);

  return (
    <Card className="mining-card w-full max-w-md">
      <div className="space-y-4">
        <div className="mining-stats">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-white/80 font-medium">{t('spaceBalance') || '$SPACE Balance'}:</span>
          </div>
          <motion.span 
            key={spaceCoins} 
            initial={{ scale: 1.2, color: '#ec4899' }} 
            animate={{ scale: 1, color: '#ffffff' }} 
            className="text-xl font-bold text-yellow-400"
          >
            {spaceCoins.toLocaleString()}
          </motion.span>
        </div>
        
        <div className="mining-stats">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span className="text-white/80 font-medium">{t('miningSpeed') || 'Mining Speed'}:</span>
          </div>
          <span className="text-xl font-bold text-blue-400">
            {miningSpeed}x
          </span>
        </div>

        {autoMiningActive && (
          <div className="mining-stats bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium">{t('autoMining') || 'Auto Mining'}:</span>
            </div>
            <span className="text-xl font-bold text-green-400">
              {formatTime(autoMiningRemainingTime)}
            </span>
          </div>
        )}

        {miningActive && remainingTime > 0 && (
          <div className="mining-stats bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-medium">{t('timeRemaining') || 'Time Remaining'}:</span>
            </div>
            <span className="text-xl font-bold text-purple-400">
              {formatTime(remainingTime)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MiningStatsCard;
