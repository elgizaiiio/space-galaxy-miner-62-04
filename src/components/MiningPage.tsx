import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';
import { UPGRADE_OPTIONS, formatTON, type UpgradeOption } from '../utils/ton';
import { hapticFeedback } from '../utils/telegram';
import { getTranslation } from '../utils/language';
import { Palette, Crown, Zap, Timer, Play, Pause, TrendingUp, Clock, Coins } from 'lucide-react';

const MINING_PHRASES = {
  en: ['Mine $SPACE Coin', 'Start Earning Now', 'Explore the Galaxy of Rewards', 'Begin Your Space Mining Journey', 'Collect Cosmic Treasures', 'Unlock Universal Wealth']
};
const MINING_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const AUTO_MINING_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

const BACKGROUND_OPTIONS = [
  {
    id: 'default',
    name: 'Default Space',
    gradient: 'from-indigo-950 via-purple-950 to-pink-950',
    price: 0,
    unlocked: true
  },
  {
    id: 'cosmic-purple',
    name: 'Cosmic Purple',
    gradient: 'from-purple-900 via-violet-800 to-indigo-900',
    price: 0.5,
    unlocked: false
  },
  {
    id: 'cyber-grid',
    name: 'Cyber Grid',
    gradient: 'from-green-900 via-cyan-800 to-blue-900',
    price: 0.5,
    unlocked: false
  },
  {
    id: 'golden-nebula',
    name: 'Golden Nebula',
    gradient: 'from-yellow-900 via-orange-800 to-red-900',
    price: 0.5,
    unlocked: false
  },
  {
    id: 'ocean-deep',
    name: 'Ocean Deep',
    gradient: 'from-blue-900 via-blue-800 to-cyan-900',
    price: 0.5,
    unlocked: false
  },
  {
    id: 'mystic-forest',
    name: 'Mystic Forest',
    gradient: 'from-green-900 via-emerald-800 to-teal-900',
    price: 0.5,
    unlocked: false
  }
];

const MiningPage: React.FC = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [miningActive, setMiningActive] = useState(false);
  const [autoMiningActive, setAutoMiningActive] = useState(false);
  const [autoMiningEndTime, setAutoMiningEndTime] = useState<number | null>(null);
  const [spaceCoins, setSpaceCoins] = useState(0);
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAutoMiningModal, setShowAutoMiningModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [miningEndTime, setMiningEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [autoMiningRemainingTime, setAutoMiningRemainingTime] = useState<number>(0);
  const [currentBackground, setCurrentBackground] = useState('default');
  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState<string[]>(['default']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalEarned, setTotalEarned] = useState(0);
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();

  // Get translation function
  const t = (key: string) => getTranslation(key);

  // Get phrases for English
  const currentPhrases = MINING_PHRASES.en;

  // Helper function to format $SPACE text with white styling
  const formatSpaceText = (text: string) => {
    const parts = text.split('$SPACE');
    if (parts.length === 1) return text;
    
    return (
      <>
        {parts[0]}
        <span className="text-white font-extrabold animate-pulse">
          $SPACE
        </span>
        {parts[1]}
      </>
    );
  };

  // Load saved state on mount
  useEffect(() => {
    const savedEndTime = localStorage.getItem('miningEndTime');
    const savedActive = localStorage.getItem('miningActive');
    const savedAutoMining = localStorage.getItem('autoMiningActive');
    const savedAutoMiningEndTime = localStorage.getItem('autoMiningEndTime');
    const savedBackground = localStorage.getItem('selectedBackground');
    const savedUnlockedBackgrounds = localStorage.getItem('unlockedBackgrounds');
    const savedTotalEarned = localStorage.getItem('totalEarned');
    const savedSpaceCoins = localStorage.getItem('spaceCoins');
    const savedMiningSpeed = localStorage.getItem('miningSpeed');

    if (savedSpaceCoins) {
      setSpaceCoins(parseInt(savedSpaceCoins));
    }
    if (savedTotalEarned) {
      setTotalEarned(parseInt(savedTotalEarned));
    }
    if (savedMiningSpeed) {
      setMiningSpeed(parseInt(savedMiningSpeed));
    }

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

    if (savedBackground) {
      setCurrentBackground(savedBackground);
    }
    if (savedUnlockedBackgrounds) {
      setUnlockedBackgrounds(JSON.parse(savedUnlockedBackgrounds));
    }
  }, []);

  // Rotate phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % currentPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentPhrases.length]);

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
        setSpaceCoins((prev) => {
          const newAmount = prev + earnedAmount;
          localStorage.setItem('spaceCoins', newAmount.toString());
          return newAmount;
        });
        setTotalEarned((prev) => {
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

  const handlePurchaseBackground = async (backgroundId: string) => {
    const background = BACKGROUND_OPTIONS.find(bg => bg.id === backgroundId);
    if (!background) return;

    if (background.price === 0 || unlockedBackgrounds.includes(backgroundId)) {
      setCurrentBackground(backgroundId);
      localStorage.setItem('selectedBackground', backgroundId);
      setShowBackgroundModal(false);
      hapticFeedback('success');
      return;
    }

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
          amount: (background.price * 1e9).toString()
        }]
      };

      await tonConnectUI.sendTransaction(transaction);
      const newUnlockedBackgrounds = [...unlockedBackgrounds, backgroundId];
      setUnlockedBackgrounds(newUnlockedBackgrounds);
      setCurrentBackground(backgroundId);
      localStorage.setItem('selectedBackground', backgroundId);
      localStorage.setItem('unlockedBackgrounds', JSON.stringify(newUnlockedBackgrounds));
      setShowBackgroundModal(false);
      hapticFeedback('success');
      toast({
        title: t('backgroundUnlocked') || 'Background Unlocked',
        description: t('backgroundUnlockedDesc') || `${background.name} unlocked and applied!`
      });
    } catch (error) {
      console.error('Background purchase failed:', error);
      toast({
        title: t('paymentFailed') || 'Payment Failed',
        description: t('backgroundPaymentError') || 'Failed to purchase background',
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

  const currentBg = BACKGROUND_OPTIONS.find(bg => bg.id === currentBackground) || BACKGROUND_OPTIONS[0];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentBg.gradient} flex flex-col items-center p-4 space-y-4 relative overflow-hidden`}>
      {/* Enhanced particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%',
            }}
          />
        ))}
      </div>

      {/* Central Mining Circle */}
      <div className="relative flex flex-col items-center justify-center mt-16">
        {/* Central Circle - Fixed (no rotation) */}
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border-4 border-white/20 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Inner glow effect */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-xl"></div>
          
          {/* SPACE AI Logo in center - Clean logo without text overlays */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <img 
              src="/lovable-uploads/d391ae90-26f4-41e1-b5c8-5451cc3c1664.png" 
              alt="SPACE AI" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Start Mining Button - Enhanced with more information */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8"
        >
          <Button
            onClick={handleStartMining}
            disabled={miningActive || autoMiningActive}
            className={`px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 shadow-lg min-w-[280px] ${
              miningActive || autoMiningActive
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-3">
                {miningActive || autoMiningActive ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
                <span className="text-xl">
                  {autoMiningActive ? 'Auto Mining Active' : miningActive ? 'Mining Active' : 'Start Mining'}
                </span>
              </div>
              
              {(miningActive || autoMiningActive) && (
                <div className="bg-black/20 px-4 py-2 rounded-full">
                  <div className="text-sm opacity-90">
                    Time Remaining: {formatTime(autoMiningActive ? autoMiningRemainingTime : remainingTime)}
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Coins className="w-4 h-4" />
                  <span>{spaceCoins.toLocaleString()} $SPACE</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>{miningSpeed}x Speed</span>
                </div>
              </div>
            </div>
          </Button>
        </motion.div>
      </div>

      {/* Bottom Stats and Actions */}
      <div className="w-full max-w-sm space-y-4 mt-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-black/25 backdrop-blur-md border border-white/15 rounded-lg">
            <CardContent className="p-3 text-center">
              <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
              <p className="text-xs text-white/70">Total Earned</p>
              <p className="font-bold text-white text-sm">{totalEarned.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-black/25 backdrop-blur-md border border-white/15 rounded-lg">
            <CardContent className="p-3 text-center">
              <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <p className="text-xs text-white/70">Mining Speed</p>
              <p className="font-bold text-white text-sm">{miningSpeed}x</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowUpgradeModal(true)}
              variant="outline"
              className="h-16 flex flex-col items-center gap-1 border-yellow-500/30 text-white bg-black/20 hover:bg-yellow-500/20 rounded-lg backdrop-blur-md"
            >
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-xs font-semibold">Upgrade</span>
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowAutoMiningModal(true)}
              variant="outline"
              disabled={autoMiningActive}
              className="h-16 flex flex-col items-center gap-1 border-green-500/30 text-white bg-black/20 hover:bg-green-500/20 rounded-lg backdrop-blur-md"
            >
              <Timer className="w-5 h-5 text-green-400" />
              <span className="text-xs font-semibold">Auto</span>
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowBackgroundModal(true)}
              variant="outline"
              className="h-16 flex flex-col items-center gap-1 border-purple-500/30 text-white bg-black/20 hover:bg-purple-500/20 rounded-lg backdrop-blur-md"
            >
              <Palette className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-semibold">Themes</span>
            </Button>
          </motion.div>
        </div>

        {/* Auto Mining Status */}
        {autoMiningActive && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30"
          >
            <Crown className="w-4 h-4 inline text-yellow-300 mr-2" />
            <span className="text-yellow-300 text-sm font-semibold">
              Auto Mining: {formatTime(autoMiningRemainingTime)}
            </span>
          </motion.div>
        )}
      </div>

      {/* Compact Modals */}
      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-xl border border-white/20 text-white max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              <Zap className="w-6 h-6 text-yellow-400 inline mr-2" />
              Mining Speed Upgrades
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {UPGRADE_OPTIONS.map((upgrade) => (
              <motion.div key={upgrade.id} whileHover={{ scale: 1.02 }}>
                <Button
                  onClick={() => handlePurchaseUpgrade(upgrade)}
                  disabled={isProcessing}
                  className="w-full p-4 h-auto flex justify-between bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300"
                  variant="ghost"
                >
                  <div className="text-left">
                    <div className="font-bold text-white text-base">{upgrade.label}</div>
                    <div className="text-sm text-blue-200">{upgrade.multiplier}x faster mining</div>
                  </div>
                  <div className="font-bold text-yellow-400 text-base">{formatTON(upgrade.price)}</div>
                </Button>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Auto Mining Modal */}
      <Dialog open={showAutoMiningModal} onOpenChange={setShowAutoMiningModal}>
        <DialogContent className="bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-xl border border-green-500/30 text-white max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              <Crown className="w-6 h-6 text-yellow-400 inline mr-2" />
              Premium Auto Mining
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-center">
            <motion.div 
              className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Timer className="w-10 h-10 text-green-400" />
            </motion.div>
            <div>
              <p className="text-green-200 mb-4 text-base">Activate auto mining for 3 consecutive days</p>
              <div className="text-3xl font-bold text-green-300 mb-2">{formatTON(0.5)}</div>
              <p className="text-sm text-green-300/80">One-time payment</p>
            </div>
            <Button
              onClick={handlePurchaseAutoMining}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-xl text-base shadow-lg"
            >
              {isProcessing ? 'Processing...' : 'Activate Auto Mining'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Background Modal */}
      <Dialog open={showBackgroundModal} onOpenChange={setShowBackgroundModal}>
        <DialogContent className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl border border-purple-500/30 text-white max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              <Palette className="w-6 h-6 text-pink-400 inline mr-2" />
              Background Themes
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {BACKGROUND_OPTIONS.map((bg) => {
              const isUnlocked = unlockedBackgrounds.includes(bg.id);
              const isCurrent = currentBackground === bg.id;
              
              return (
                <motion.div key={bg.id} whileHover={{ scale: 1.02 }}>
                  <Button
                    onClick={() => handlePurchaseBackground(bg.id)}
                    disabled={isCurrent || (isProcessing && bg.price > 0)}
                    className={`w-full p-4 h-auto flex justify-between border border-white/30 rounded-xl transition-all duration-300 ${
                      isCurrent ? 'bg-green-600/30 border-green-500/50' : 'bg-white/10 hover:bg-white/20'
                    }`}
                    variant="ghost"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${bg.gradient} border-2 border-white/30`}></div>
                      <div className="text-left">
                        <div className="font-bold text-white text-base">{bg.name}</div>
                        {isCurrent && <div className="text-sm text-green-200">Currently Active</div>}
                      </div>
                    </div>
                    <div className="text-right">
                      {bg.price === 0 || isUnlocked ? (
                        <span className="text-green-400 font-bold text-base">
                          {isCurrent ? '✓ Active' : 'Select'}
                        </span>
                      ) : (
                        <div className="font-bold text-purple-300 text-base">{formatTON(bg.price)}</div>
                      )}
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MiningPage;
