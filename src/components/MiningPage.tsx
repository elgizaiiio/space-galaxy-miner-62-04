
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';
import SpaceLogo3D from './SpaceLogo3D';
import LanguageSwitcher from './LanguageSwitcher';
import { UPGRADE_OPTIONS, formatTON, type UpgradeOption } from '../utils/ton';
import { hapticFeedback } from '../utils/telegram';
import { getStoredLanguage, getTranslation } from '../utils/language';
import { 
  Crown, Zap, Play, Pause, Clock, Coins, Rocket, Star,
  ChevronRight, Sparkles, Flame, Settings
} from 'lucide-react';

const MINING_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const AUTO_MINING_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

const MiningPage: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [miningActive, setMiningActive] = useState(false);
  const [autoMiningActive, setAutoMiningActive] = useState(false);
  const [autoMiningEndTime, setAutoMiningEndTime] = useState<number | null>(null);
  const [spaceCoins, setSpaceCoins] = useState(0);
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAutoMiningModal, setShowAutoMiningModal] = useState(false);
  const [miningEndTime, setMiningEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [autoMiningRemainingTime, setAutoMiningRemainingTime] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();

  const t = (key: string) => getTranslation(key, currentLanguage.code);

  // Load saved state on mount
  useEffect(() => {
    const savedEndTime = localStorage.getItem('miningEndTime');
    const savedActive = localStorage.getItem('miningActive');
    const savedAutoMining = localStorage.getItem('autoMiningActive');
    const savedAutoMiningEndTime = localStorage.getItem('autoMiningEndTime');
    const savedTotalEarned = localStorage.getItem('totalEarned');
    const savedSpaceCoins = localStorage.getItem('spaceCoins');
    const savedMiningSpeed = localStorage.getItem('miningSpeed');

    if (savedSpaceCoins) setSpaceCoins(parseInt(savedSpaceCoins));
    if (savedTotalEarned) setTotalEarned(parseInt(savedTotalEarned));
    if (savedMiningSpeed) setMiningSpeed(parseInt(savedMiningSpeed));

    if (savedEndTime && savedActive === 'true') {
      const endTime = parseInt(savedEndTime);
      const now = Date.now();
      if (now < endTime) {
        setMiningActive(true);
        setMiningEndTime(endTime);
        setRemainingTime(endTime - now);
      } else {
        localStorage.removeItem('miningEndTime');
        localStorage.removeItem('miningActive');
      }
    }

    if (savedAutoMining === 'true' && savedAutoMiningEndTime) {
      const autoEndTime = parseInt(savedAutoMiningEndTime);
      const now = Date.now();
      if (now < autoEndTime) {
        setAutoMiningActive(true);
        setAutoMiningEndTime(autoEndTime);
        setAutoMiningRemainingTime(autoEndTime - now);
      } else {
        localStorage.removeItem('autoMiningActive');
        localStorage.removeItem('autoMiningEndTime');
      }
    }
  }, []);

  // Update remaining time for regular mining
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (miningActive && miningEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = miningEndTime - now;
        if (remaining <= 0) {
          setMiningActive(false);
          setMiningEndTime(null);
          setRemainingTime(0);
          localStorage.removeItem('miningEndTime');
          localStorage.removeItem('miningActive');
          toast({
            title: t('miningCompleted') || 'Mining Completed',
            description: t('miningCompletedDesc') || 'Your 8-hour mining session has finished'
          });
          if (autoMiningActive) {
            setTimeout(() => {
              handleStartMining();
            }, 1000);
          }
        } else {
          setRemainingTime(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [miningActive, miningEndTime, autoMiningActive, toast, t]);

  // Update remaining time for auto mining
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoMiningActive && autoMiningEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = autoMiningEndTime - now;
        if (remaining <= 0) {
          setAutoMiningActive(false);
          setAutoMiningEndTime(null);
          setAutoMiningRemainingTime(0);
          localStorage.removeItem('autoMiningActive');
          localStorage.removeItem('autoMiningEndTime');
          toast({
            title: t('autoMiningExpired') || 'Auto Mining Expired',
            description: t('autoMiningExpiredDesc') || 'Your auto mining period has ended'
          });
        } else {
          setAutoMiningRemainingTime(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [autoMiningActive, autoMiningEndTime, toast, t]);

  // Mining logic for coins
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (miningActive || autoMiningActive) {
      interval = setInterval(() => {
        const earnedAmount = miningSpeed;
        setSpaceCoins(prev => {
          const newAmount = prev + earnedAmount;
          localStorage.setItem('spaceCoins', newAmount.toString());
          return newAmount;
        });
        setTotalEarned(prev => {
          const newTotal = prev + earnedAmount;
          localStorage.setItem('totalEarned', newTotal.toString());
          return newTotal;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [miningActive, autoMiningActive, miningSpeed]);

  const handleStartMining = () => {
    if (!miningActive) {
      const endTime = Date.now() + MINING_DURATION;
      setMiningActive(true);
      setMiningEndTime(endTime);
      setRemainingTime(MINING_DURATION);
      localStorage.setItem('miningEndTime', endTime.toString());
      localStorage.setItem('miningActive', 'true');
      hapticFeedback('success');
      toast({
        title: t('miningStarted') || 'Mining Started',
        description: t('miningStartedDesc') || 'Mining will automatically stop after 8 hours'
      });
    }
  };

  const handlePurchaseUpgrade = async (upgrade: UpgradeOption) => {
    if (!tonConnectUI.wallet) {
      toast({
        title: t('walletRequired') || 'Wallet Required',
        description: t('connectWalletFirst') || 'Please connect your TON wallet first',
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{
          address: 'UQASDdSDAEVR8h5faVs7m8ZSxt-ib4I87gQHUoSrOXszNxxf',
          amount: (upgrade.price * 1e9).toString()
        }]
      };
      await tonConnectUI.sendTransaction(transaction);
      setMiningSpeed(upgrade.multiplier);
      localStorage.setItem('miningSpeed', upgrade.multiplier.toString());
      setShowUpgradeModal(false);
      hapticFeedback('success');
      toast({
        title: t('upgradeSuccess') || 'Upgrade Successful',
        description: t('miningSpeedIncreased') || `Mining speed increased to ${upgrade.label}!`
      });
    } catch (error) {
      console.error('Mining upgrade purchase failed:', error);
      toast({
        title: t('paymentFailed') || 'Payment Failed',
        description: t('upgradePaymentError') || 'Failed to purchase mining upgrade',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchaseAutoMining = async () => {
    if (!tonConnectUI.wallet) {
      toast({
        title: t('walletRequired') || 'Wallet Required',
        description: t('connectWalletFirst') || 'Please connect your TON wallet first',
        variant: "destructive"
      });
      return;
    }
    setIsProcessing(true);
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{
          address: 'UQASDdSDAEVR8h5faVs7m8ZSxt-ib4I87gQHUoSrOXszNxxf',
          amount: (0.5 * 1e9).toString()
        }]
      };
      await tonConnectUI.sendTransaction(transaction);
      const endTime = Date.now() + AUTO_MINING_DURATION;
      setAutoMiningActive(true);
      setAutoMiningEndTime(endTime);
      setAutoMiningRemainingTime(AUTO_MINING_DURATION);
      localStorage.setItem('autoMiningActive', 'true');
      localStorage.setItem('autoMiningEndTime', endTime.toString());
      setShowAutoMiningModal(false);
      hapticFeedback('success');
      toast({
        title: t('autoMiningActivated') || 'Auto Mining Activated',
        description: t('autoMiningActivatedDesc') || 'Auto mining activated for 3 days!'
      });
    } catch (error) {
      console.error('Auto mining purchase failed:', error);
      toast({
        title: t('paymentFailed') || 'Payment Failed',
        description: t('autoMiningPaymentError') || 'Failed to purchase auto mining',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (milliseconds: number): string => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      {/* Simple background pattern */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Space Mining</h1>
            <p className="text-sm text-white/70">Cosmic Rewards Await</p>
          </div>
        </div>
        <LanguageSwitcher onLanguageChange={() => setCurrentLanguage(getStoredLanguage())} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-6 space-y-8">
        {/* 3D Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <SpaceLogo3D size={1} className="w-48 h-24" />
          
          {(miningActive || autoMiningActive) && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>

        {/* Balance Display */}
        <Card className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-sm">
          <CardContent className="p-6 text-center">
            <motion.div
              key={spaceCoins}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {spaceCoins.toLocaleString()}
              </div>
              <p className="text-sm text-white/70">$SPACE Coins</p>
            </motion.div>

            {/* Status Indicator */}
            {(miningActive || autoMiningActive) && (
              <div className="flex items-center justify-center gap-2 mt-4 p-2 bg-green-500/20 rounded-lg">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
                <span className="text-green-400 text-sm font-medium">
                  {autoMiningActive ? 'Auto Mining' : 'Mining'} Active
                </span>
                {miningActive && (
                  <span className="text-white/70 text-sm">
                    • {formatTime(remainingTime)}
                  </span>
                )}
              </div>
            )}

            {autoMiningActive && (
              <div className="mt-2 p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <div className="flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-200 text-xs">
                    Auto Mining: {formatTime(autoMiningRemainingTime)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-green-400" />
                <span className="text-sm text-white/70">Total Earned</span>
              </div>
              <p className="text-lg font-bold text-green-400">{totalEarned.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-white/70">Speed</span>
              </div>
              <p className="text-lg font-bold text-blue-400">{miningSpeed}x</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          {/* Main Mining Button */}
          <Button
            onClick={handleStartMining}
            disabled={miningActive || autoMiningActive}
            className={`w-full h-14 text-lg font-bold rounded-xl transition-all duration-300 ${
              miningActive || autoMiningActive
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            <div className="flex items-center gap-3">
              {autoMiningActive ? (
                <>
                  <Crown className="w-5 h-5" />
                  <span>Auto Mining Active</span>
                </>
              ) : miningActive ? (
                <>
                  <Flame className="w-5 h-5" />
                  <span>Mining Active</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>{t('startMining') || 'Start Mining'}</span>
                </>
              )}
            </div>
          </Button>

          {/* Feature Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setShowUpgradeModal(true)}
              variant="outline"
              className="h-12 border-blue-500/30 text-white bg-blue-500/10 hover:bg-blue-500/20"
            >
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-xs">{t('upgrade') || 'Upgrade'}</span>
              </div>
            </Button>

            <Button
              onClick={() => setShowAutoMiningModal(true)}
              variant="outline"
              disabled={autoMiningActive}
              className="h-12 border-yellow-500/30 text-white bg-yellow-500/10 hover:bg-yellow-500/20"
            >
              <div className="flex flex-col items-center gap-1">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-xs">{t('autoMining') || 'Auto Mine'}</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-xl border border-white/20 text-white max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              {t('upgradeMiningSpeed') || 'Upgrade Mining Speed'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {UPGRADE_OPTIONS.map((upgrade, index) => (
              <Button
                key={upgrade.id}
                onClick={() => handlePurchaseUpgrade(upgrade)}
                disabled={isProcessing}
                className="w-full p-4 h-auto flex justify-between items-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl"
                variant="ghost"
              >
                <div className="text-left">
                  <div className="font-bold text-white">{upgrade.label}</div>
                  <div className="text-sm text-blue-200">
                    {upgrade.multiplier}x {t('fasterMining') || 'faster mining'}
                  </div>
                </div>
                <div className="font-bold text-yellow-400">
                  {formatTON(upgrade.price)}
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Auto Mining Modal */}
      <Dialog open={showAutoMiningModal} onOpenChange={setShowAutoMiningModal}>
        <DialogContent className="bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-xl border border-green-500/30 text-white max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              {t('autoMining') || 'Auto Mining'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Settings className="w-8 h-8 text-green-400" />
            </div>
            
            <div>
              <p className="text-green-200 mb-4">
                {t('autoMiningDesc') || 'Enable automatic mining for 3 days. Your coins will be mined continuously.'}
              </p>
              <div className="text-3xl font-bold text-green-300 mb-2">
                {formatTON(0.5)}
              </div>
              <p className="text-green-200">
                {t('threeDaysDuration') || '3 Days Duration'}
              </p>
            </div>
            
            <Button
              onClick={handlePurchaseAutoMining}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl"
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  {t('processing') || 'Processing...'}
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  {t('purchaseAutoMining') || 'Purchase Auto Mining'}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MiningPage;
