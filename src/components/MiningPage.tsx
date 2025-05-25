
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SpaceLogo3D from './SpaceLogo3D';
import { UPGRADE_OPTIONS, formatTON, type UpgradeOption } from '../utils/ton';
import { hapticFeedback } from '../utils/telegram';
import { Zap, Play, Pause, TrendingUp, Star, Coins } from 'lucide-react';

interface MiningPageProps {
  isWalletConnected: boolean;
  onConnectWallet: () => void;
  onPurchaseUpgrade: (upgrade: UpgradeOption) => void;
}

const MINING_PHRASES = [
  'استكشف $SPACE Coin',
  'ابدأ الكسب الآن',
  'اكتشف مجرة المكافآت',
  'ابدأ رحلة التعدين الفضائية',
  'اجمع الكنوز الكونية',
  'اكتشف الثروة الكونية'
];

const MiningPage: React.FC<MiningPageProps> = ({ 
  isWalletConnected, 
  onConnectWallet, 
  onPurchaseUpgrade 
}) => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [miningActive, setMiningActive] = useState(false);
  const [spaceCoins, setSpaceCoins] = useState(0);
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Rotate phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % MINING_PHRASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Mining logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (miningActive && isWalletConnected) {
      interval = setInterval(() => {
        setSpaceCoins((prev) => prev + miningSpeed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [miningActive, isWalletConnected, miningSpeed]);

  const handleStartMining = () => {
    if (!isWalletConnected) {
      onConnectWallet();
      return;
    }
    setMiningActive(!miningActive);
    hapticFeedback(miningActive ? 'light' : 'success');
  };

  const handleUpgradeClick = () => {
    if (!isWalletConnected) {
      onConnectWallet();
      return;
    }
    setShowUpgradeModal(true);
    hapticFeedback('light');
  };

  const handlePurchaseUpgrade = (upgrade: UpgradeOption) => {
    onPurchaseUpgrade(upgrade);
    setMiningSpeed(upgrade.multiplier);
    setShowUpgradeModal(false);
    hapticFeedback('success');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 pt-8 space-y-6 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20">
      {/* Header Stats Bar */}
      <div className="w-full max-w-md mb-4">
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border-white/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-xs text-white/60">رصيد $SPACE</p>
                <motion.p
                  key={spaceCoins}
                  initial={{ scale: 1.2, color: '#ec4899' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  className="text-lg font-bold"
                >
                  {spaceCoins.toLocaleString()}
                </motion.p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div className="text-right">
                <p className="text-xs text-white/60">سرعة التعدين</p>
                <p className="text-lg font-bold text-green-400">{miningSpeed}x</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3D Logo with Enhanced Glow */}
      <motion.div
        initial={{ scale: 0, rotateY: -180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative mb-6"
      >
        <div className="relative">
          <SpaceLogo3D size={1} className="w-80 h-40" />
          {miningActive && (
            <>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1.5, 1.2],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Dynamic Phrases with Better Styling */}
      <div className="text-center h-20 flex items-center mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhrase}
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-2">
              {MINING_PHRASES[currentPhrase]}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Status Card */}
      <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-white/20 p-6 w-full max-w-md shadow-2xl">
        <div className="space-y-6">
          {/* Mining Status */}
          <div className="flex items-center justify-center space-x-3">
            <motion.div
              className={`w-4 h-4 rounded-full ${
                miningActive ? 'bg-green-500' : 'bg-red-500'
              }`}
              animate={{
                scale: miningActive ? [1, 1.3, 1] : 1,
                boxShadow: miningActive 
                  ? ['0 0 10px rgba(34, 197, 94, 0.5)', '0 0 20px rgba(34, 197, 94, 0.8)', '0 0 10px rgba(34, 197, 94, 0.5)']
                  : 'none'
              }}
              transition={{
                duration: 1.5,
                repeat: miningActive ? Infinity : 0,
              }}
            />
            <span className={`text-lg font-semibold ${miningActive ? 'text-green-400' : 'text-red-400'}`}>
              {miningActive ? 'التعدين نشط' : 'التعدين متوقف'}
            </span>
          </div>

          {/* Progress Bar for Mining */}
          {miningActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm text-white/70">
                <span>التقدم</span>
                <span>{miningSpeed}/ثانية</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Enhanced Action Buttons */}
      <div className="space-y-4 w-full max-w-md">
        <Button
          onClick={handleStartMining}
          className={`w-full h-16 text-lg font-bold rounded-xl bg-gradient-to-r transition-all duration-300 transform hover:scale-105 ${
            miningActive 
              ? 'from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg shadow-red-500/25' 
              : 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25'
          } ${miningActive ? 'animate-pulse' : ''}`}
          size="lg"
        >
          <div className="flex items-center justify-center space-x-3">
            {miningActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            <span>
              {!isWalletConnected
                ? 'ربط المحفظة للتعدين'
                : miningActive
                ? 'إيقاف التعدين'
                : 'بدء التعدين'}
            </span>
          </div>
        </Button>

        <Button
          onClick={handleUpgradeClick}
          variant="outline"
          className="w-full h-14 text-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 text-white hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-400 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20"
          size="lg"
        >
          <div className="flex items-center justify-center space-x-3">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span>ترقية سرعة التعدين</span>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
        </Button>
      </div>

      {/* Enhanced Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-2 border-purple-500/30 text-white max-w-md mx-4 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center space-x-2">
              <Zap className="w-7 h-7 text-yellow-400" />
              <span>ترقية سرعة التعدين</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {UPGRADE_OPTIONS.map((upgrade, index) => (
              <motion.div
                key={upgrade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => handlePurchaseUpgrade(upgrade)}
                  className="w-full p-4 h-auto flex justify-between items-center bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-purple-400/30 hover:border-purple-400/60 rounded-xl transition-all duration-300"
                  variant="ghost"
                >
                  <div className="text-right">
                    <div className="font-bold text-lg flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span>{upgrade.label}</span>
                    </div>
                    <div className="text-sm text-purple-300">
                      {upgrade.multiplier}x أسرع في التعدين
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                      {formatTON(upgrade.price)}
                    </div>
                    <div className="text-xs text-white/50">TON حقيقي</div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
            <p className="text-sm text-center text-yellow-200 flex items-center justify-center space-x-2">
              <Coins className="w-5 h-5" />
              <span>المدفوعات تتم عبر شبكة TON الحقيقية</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MiningPage;
