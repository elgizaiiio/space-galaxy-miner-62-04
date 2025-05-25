
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap, Crown, Palette } from 'lucide-react';
import { getTranslation } from '../utils/language';

interface MiningActionButtonsProps {
  handleStartMining: () => void;
  autoMiningActive: boolean;
  miningActive: boolean;
  remainingTime: number;
  setShowUpgradeModal: (show: boolean) => void;
  setShowAutoMiningModal: (show: boolean) => void;
  setShowBackgroundModal: (show: boolean) => void;
  currentLanguage: { code: string };
  formatTime: (milliseconds: number) => string;
}

const MiningActionButtons: React.FC<MiningActionButtonsProps> = ({
  handleStartMining,
  autoMiningActive,
  miningActive,
  remainingTime,
  setShowUpgradeModal,
  setShowAutoMiningModal,
  setShowBackgroundModal,
  currentLanguage,
  formatTime
}) => {
  const t = (key: string) => getTranslation(key, currentLanguage.code);

  return (
    <div className="space-y-4 w-full max-w-md">
      <Button 
        onClick={handleStartMining} 
        disabled={autoMiningActive}
        className={`mining-button ${miningActive ? 'active' : ''}`}
        size="lg"
      >
        {autoMiningActive
          ? `${t('autoMiningActive') || 'Auto Mining Active'} ⚡`
          : miningActive 
          ? `${t('stopMining') || 'Stop Mining'} (${formatTime(remainingTime)})` 
          : t('startMining') || 'Start Mining'
        }
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={() => setShowUpgradeModal(true)} 
          variant="outline" 
          className="upgrade-card border-blue-500/30 text-blue-300 hover:text-blue-200 hover:border-blue-400/50" 
          size="lg"
        >
          <Zap className="w-4 h-4 mr-2" />
          {t('upgrade') || 'Upgrade'}
        </Button>

        <Button 
          onClick={() => setShowAutoMiningModal(true)} 
          variant="outline" 
          className="upgrade-card border-green-500/30 text-green-300 hover:text-green-200 hover:border-green-400/50" 
          size="lg"
          disabled={autoMiningActive}
        >
          <Crown className="w-4 h-4 mr-2" />
          {autoMiningActive 
            ? t('autoActive') || 'Auto Active'
            : t('autoMining') || 'Auto Mining'
          }
        </Button>
      </div>

      <Button 
        onClick={() => setShowBackgroundModal(true)} 
        variant="outline" 
        className="upgrade-card border-purple-500/30 text-purple-300 hover:text-purple-200 hover:border-purple-400/50" 
        size="lg"
      >
        <Palette className="w-4 h-4 mr-2" />
        {t('changeTheme') || 'Change Theme'}
      </Button>
    </div>
  );
};

export default MiningActionButtons;
