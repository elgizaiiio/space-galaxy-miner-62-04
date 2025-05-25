import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';
import SpaceLogo3D from './SpaceLogo3D';
import LanguageSwitcher from './LanguageSwitcher';
import { UPGRADE_OPTIONS, formatTON, textToBase64, type UpgradeOption } from '../utils/ton';
import { hapticFeedback } from '../utils/telegram';
import { getStoredLanguage, getTranslation } from '../utils/language';
import { Palette, Crown, Zap, Timer } from 'lucide-react';

const MINING_PHRASES = {
  en: ['Mine $SPACE Coin', 'Start Earning Now', 'Explore the Galaxy of Rewards', 'Begin Your Space Mining Journey', 'Collect Cosmic Treasures', 'Unlock Universal Wealth'],
  ar: ['عدن عملة $SPACE', 'ابدأ الكسب الآن', 'استكشف مجرة المكافآت', 'ابدأ رحلة التعدين الفضائية', 'اجمع الكنوز الكونية', 'افتح الثروة الكونية'],
  ru: ['Добывайте $SPACE монеты', 'Начните зарабатывать сейчас', 'Исследуйте галактику наград', 'Начните космическое путешествие майнинга', 'Собирайте космические сокровища', 'Откройте вселенское богатство'],
  zh: ['挖掘$SPACE币', '立即开始赚钱', '探索奖励银河', '开始太空挖矿之旅', '收集宇宙宝藏', '解锁宇宙财富'],
  hi: ['$SPACE सिक्का माइन करें', 'अभी कमाना शुरू करें', 'पुरस्कारों की आकाशगंगा का अन्वेषण करें', 'अपनी स्पेस माइनिंग यात्रा शुरू करें', 'ब्रह्मांडीय खजाने इकट्ठा करें', 'सार्वभौमिक धन अनलॉक करें'],
  es: ['Mina monedas $SPACE', 'Comienza a ganar ahora', 'Explora la galaxia de recompensas', 'Comienza tu viaje de minera espacial', 'Recolecta tesoros cósmicos', 'Desbloquea riqueza universal'],
  fr: ['Minez des pièces $SPACE', 'Commencez à gagner maintenant', 'Explorez la galaxie des récompenses', 'Commencez votre voyage de minage spatial', 'Collectez des trésors cosmiques', 'Débloquez la richesse universelle'],
  de: ['Mine $SPACE Münzen', 'Beginne jetzt zu verdienen', 'Erkunde die Galaxie der Belohnungen', 'Beginne deine Weltraum-Mining-Reise', 'Sammle kosmische Schätze', 'Entsperre universellen Reichtum'],
  ja: ['$SPACEコインをマイニング', '今すぐ稼ぎ始める', '報酬の銀河を探索', '宇宙マイニングの旅を始める', '宇宙の宝物を集める', '宇宙の富をアンロック'],
  tr: ['$SPACE Coin madenciliği yap', 'Şimdi kazanmaya başla', 'Ödüller galaksisini keşfet', 'Uzay madencilik yolculuğuna başla', 'Kozmik hazineler topla', 'Evrensel zenginliği aç'],
  pt: ['Mine moedas $SPACE', 'Comece a ganhar agora', 'Explore a galáxia de recompensas', 'Comece sua jornada de mineração espacial', 'Colete tesouros cósmicos', 'Desbloqueie riqueza universal'],
  uk: ['Добувайте монети $SPACE', 'Почніть заробляти зараз', 'Досліджуйте галактику нагород', 'Розпочніть свою космічну подорож майнінгу', 'Збирайте космічні скарби', 'Відкрийте універсальне багатство']
};

const MINING_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
const AUTO_MINING_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

const BACKGROUND_OPTIONS = [
  { id: 'default', name: 'Default Space', gradient: 'from-indigo-950 via-purple-950 to-pink-950', price: 0, unlocked: true },
  { id: 'cosmic-purple', name: 'Cosmic Purple', gradient: 'from-purple-900 via-violet-800 to-indigo-900', price: 0.5, unlocked: false },
  { id: 'cyber-grid', name: 'Cyber Grid', gradient: 'from-green-900 via-cyan-800 to-blue-900', price: 0.5, unlocked: false },
  { id: 'golden-nebula', name: 'Golden Nebula', gradient: 'from-yellow-900 via-orange-800 to-red-900', price: 0.5, unlocked: false },
  { id: 'ocean-deep', name: 'Ocean Deep', gradient: 'from-blue-900 via-blue-800 to-cyan-900', price: 0.5, unlocked: false },
  { id: 'mystic-forest', name: 'Mystic Forest', gradient: 'from-green-900 via-emerald-800 to-teal-900', price: 0.5, unlocked: false },
];

const MiningPage: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
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
  
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();

  // Get translation function for current language
  const t = (key: string) => getTranslation(key, currentLanguage.code);

  // Get phrases for current language
  const currentPhrases = MINING_PHRASES[currentLanguage.code as keyof typeof MINING_PHRASES] || MINING_PHRASES.en;

  // Update language when it changes
  useEffect(() => {
    setCurrentLanguage(getStoredLanguage());
  }, []);

  // Load saved state on mount
  useEffect(() => {
    const savedEndTime = localStorage.getItem('miningEndTime');
    const savedActive = localStorage.getItem('miningActive');
    const savedAutoMining = localStorage.getItem('autoMiningActive');
    const savedAutoMiningEndTime = localStorage.getItem('autoMiningEndTime');
    const savedBackground = localStorage.getItem('selectedBackground');
    const savedUnlockedBackgrounds = localStorage.getItem('unlockedBackgrounds');
    
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
      setCurrentPhrase(prev => (prev + 1) % currentPhrases.length);
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
  }, [miningActive, miningEndTime, autoMiningActive]);

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
    if ((miningActive || autoMiningActive)) {
      interval = setInterval(() => {
        setSpaceCoins(prev => prev + miningSpeed);
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
    } else {
      setMiningActive(false);
      setMiningEndTime(null);
      setRemainingTime(0);
      
      localStorage.removeItem('miningEndTime');
      localStorage.removeItem('miningActive');
      
      hapticFeedback('light');
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
      const comment = `Mining Speed Upgrade: ${upgrade.label}`;
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: 'UQASDdSDAEVR8h5faVs7m8ZSxt-ib4I87gQHUoSrOXszNxxf',
            amount: (upgrade.price * 1e9).toString(),
          }
        ]
      };

      await tonConnectUI.sendTransaction(transaction);
      
      setMiningSpeed(upgrade.multiplier);
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
        messages: [
          {
            address: 'UQASDdSDAEVR8h5faVs7m8ZSxt-ib4I87gQHUoSrOXszNxxf',
            amount: (0.5 * 1e9).toString(),
          }
        ]
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
        messages: [
          {
            address: 'UQASDdSDAEVR8h5faVs7m8ZSxt-ib4I87gQHUoSrOXszNxxf',
            amount: (background.price * 1e9).toString(),
          }
        ]
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
    <div className={`min-h-screen bg-gradient-to-br ${currentBg.gradient} flex flex-col items-center justify-center p-4 space-y-8`}>
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher onLanguageChange={() => setCurrentLanguage(getStoredLanguage())} />
      </div>

      {/* 3D Logo */}
      <motion.div 
        initial={{ scale: 0, rotateY: -180 }} 
        animate={{ scale: 1, rotateY: 0 }} 
        transition={{ duration: 1, ease: "easeOut" }} 
        className="relative"
      >
        <SpaceLogo3D size={1.2} className="w-96 h-48" />
        {(miningActive || autoMiningActive) && (
          <motion.div 
            className="absolute inset-0 bg-mining-glow rounded-full" 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} 
          />
        )}
      </motion.div>

      {/* Dynamic Phrases */}
      <div className="text-center h-16 flex items-center">
        <AnimatePresence mode="wait">
          <motion.h1 
            key={currentPhrase} 
            initial={{ y: 50, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -50, opacity: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }} 
            className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-space-gradient"
          >
            {currentPhrases[currentPhrase]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Mining Stats */}
      <Card className="glass-card p-6 w-full max-w-md bg-blue-900">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/80">{t('spaceBalance') || '$SPACE Balance'}:</span>
            <motion.span 
              key={spaceCoins} 
              initial={{ scale: 1.2, color: '#ec4899' }} 
              animate={{ scale: 1, color: '#ffffff' }} 
              className="text-xl font-bold"
            >
              {spaceCoins.toLocaleString()}
            </motion.span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white/80">{t('miningSpeed') || 'Mining Speed'}:</span>
            <span className="text-xl font-bold text-amber-200">
              {miningSpeed}x
            </span>
          </div>

          {autoMiningActive && (
            <div className="flex items-center justify-between">
              <span className="text-white/80">{t('autoMining') || 'Auto Mining'}:</span>
              <span className="text-xl font-bold text-green-400">
                {formatTime(autoMiningRemainingTime)}
              </span>
            </div>
          )}

          {miningActive && remainingTime > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-white/80">{t('timeRemaining') || 'Time Remaining'}:</span>
              <span className="text-xl font-bold text-green-400">
                {formatTime(remainingTime)}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-4 w-full max-w-md">
        <Button 
          onClick={handleStartMining} 
          disabled={autoMiningActive}
          className={`w-full space-button ${miningActive ? 'animate-pulse-glow' : ''}`} 
          size="lg"
        >
          {autoMiningActive
            ? `${t('autoMiningActive') || 'Auto Mining Active'} ⚡`
            : miningActive 
            ? `${t('stopMining') || 'Stop Mining'} (${formatTime(remainingTime)})` 
            : t('startMining') || 'Start Mining'
          }
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={() => setShowUpgradeModal(true)} 
            variant="outline" 
            className="bg-white/10 border-white/30 text-white hover:bg-white/20" 
            size="lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            {t('upgrade') || 'Upgrade'}
          </Button>

          <Button 
            onClick={() => setShowAutoMiningModal(true)} 
            variant="outline" 
            className="bg-green/10 border-green/30 text-white hover:bg-green/20" 
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
          className="w-full bg-purple/10 border-purple/30 text-white hover:bg-purple/20" 
          size="lg"
        >
          <Palette className="w-4 h-4 mr-2" />
          {t('changeTheme') || 'Change Theme'}
        </Button>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="glass-card border-white/20 text-white max-w-md bg-indigo-700">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-clip-text bg-space-gradient text-gray-50">
              {t('upgradeMiningSpeed') || 'Upgrade Mining Speed'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {UPGRADE_OPTIONS.map(upgrade => (
              <motion.div key={upgrade.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => handlePurchaseUpgrade(upgrade)} 
                  className="w-full p-4 h-auto flex justify-between items-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl" 
                  variant="ghost"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">{upgrade.label}</div>
                    <div className="text-sm text-white/70">
                      {upgrade.multiplier}x {t('fasterMining') || 'faster mining'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-space-pink bg-transparent">
                      {formatTON(upgrade.price)}
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Auto Mining Modal */}
      <Dialog open={showAutoMiningModal} onOpenChange={setShowAutoMiningModal}>
        <DialogContent className="glass-card border-white/20 text-white max-w-md bg-green-700">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-100 flex items-center justify-center gap-2">
              <Crown className="w-6 h-6" />
              {t('autoMining') || 'Auto Mining'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Timer className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-green-200 mb-4">
                {t('autoMiningDesc') || 'Enable automatic mining for 3 days. Your coins will be mined continuously without manual intervention.'}
              </p>
              <div className="text-3xl font-bold text-green-300 mb-2">
                {formatTON(0.5)}
              </div>
              <p className="text-green-200 text-sm">
                {t('threeDaysDuration') || '3 Days Duration'}
              </p>
            </div>
            
            <Button 
              onClick={handlePurchaseAutoMining}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl"
            >
              {isProcessing 
                ? t('processing') || 'Processing...'
                : t('purchaseAutoMining') || 'Purchase Auto Mining'
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Background Modal */}
      <Dialog open={showBackgroundModal} onOpenChange={setShowBackgroundModal}>
        <DialogContent className="glass-card border-white/20 text-white max-w-md bg-purple-700">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-purple-100 flex items-center justify-center gap-2">
              <Palette className="w-6 h-6" />
              {t('changeTheme') || 'Change Theme'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {BACKGROUND_OPTIONS.map(bg => {
              const isUnlocked = unlockedBackgrounds.includes(bg.id);
              const isCurrent = currentBackground === bg.id;
              
              return (
                <motion.div key={bg.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={() => handlePurchaseBackground(bg.id)}
                    disabled={isCurrent || (isProcessing && bg.price > 0)}
                    className={`w-full p-4 h-auto flex justify-between items-center border border-white/20 rounded-xl ${
                      isCurrent 
                        ? 'bg-green-600 hover:bg-green-600' 
                        : isUnlocked
                        ? 'bg-blue-500/20 hover:bg-blue-500/30'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    variant="ghost"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${bg.gradient}`}></div>
                      <div className="text-left">
                        <div className="font-bold text-lg">{bg.name}</div>
                        {isCurrent && (
                          <div className="text-sm text-green-200">
                            {t('currentBackground') || 'Current'}
                          </div>
                        )}
                        {isUnlocked && !isCurrent && (
                          <div className="text-sm text-blue-200">
                            {t('unlocked') || 'Unlocked'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {bg.price === 0 || isUnlocked ? (
                        <span className="text-green-400 font-bold">
                          {isCurrent ? '✓' : t('select') || 'Select'}
                        </span>
                      ) : (
                        <div className="font-bold text-purple-300">
                          {formatTON(bg.price)}
                        </div>
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
