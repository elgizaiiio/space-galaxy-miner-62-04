import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Palette, Crown, Zap, Timer, Play, Pause, TrendingUp, Clock, Coins } from 'lucide-react';
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

const BACKGROUND_OPTIONS = [{
  id: 'default',
  name: 'Default Space',
  gradient: 'from-indigo-950 via-purple-950 to-pink-950',
  price: 0,
  unlocked: true
}, {
  id: 'cosmic-purple',
  name: 'Cosmic Purple',
  gradient: 'from-purple-900 via-violet-800 to-indigo-900',
  price: 0.5,
  unlocked: false
}, {
  id: 'cyber-grid',
  name: 'Cyber Grid',
  gradient: 'from-green-900 via-cyan-800 to-blue-900',
  price: 0.5,
  unlocked: false
}, {
  id: 'golden-nebula',
  name: 'Golden Nebula',
  gradient: 'from-yellow-900 via-orange-800 to-red-900',
  price: 0.5,
  unlocked: false
}, {
  id: 'ocean-deep',
  name: 'Ocean Deep',
  gradient: 'from-blue-900 via-blue-800 to-cyan-900',
  price: 0.5,
  unlocked: false
}, {
  id: 'mystic-forest',
  name: 'Mystic Forest',
  gradient: 'from-green-900 via-emerald-800 to-teal-900',
  price: 0.5,
  unlocked: false
}];
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
  const [totalEarned, setTotalEarned] = useState(0);
  const [tonConnectUI] = useTonConnectUI();
  const {
    toast
  } = useToast();

  // Get translation function for current language
  const t = (key: string) => getTranslation(key, currentLanguage.code);

  // Get phrases for current language
  const currentPhrases = MINING_PHRASES[currentLanguage.code as keyof typeof MINING_PHRASES] || MINING_PHRASES.en;

  // Helper function to format $SPACE text with special styling
  const formatSpaceText = (text: string) => {
    const parts = text.split('$SPACE');
    if (parts.length === 1) return text;
    return <>
        {parts[0]}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 font-extrabold animate-pulse">
          $SPACE
        </span>
        {parts[1]}
      </>;
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
    const hours = Math.floor(milliseconds % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
    const minutes = Math.floor(milliseconds % (1000 * 60 * 60) / (1000 * 60));
    const seconds = Math.floor(milliseconds % (1000 * 60) / 1000);
    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const currentBg = BACKGROUND_OPTIONS.find(bg => bg.id === currentBackground) || BACKGROUND_OPTIONS[0];
  return <div className={`min-h-screen bg-gradient-to-br ${currentBg.gradient} flex flex-col items-center justify-center p-4 space-y-6 relative overflow-hidden`}>
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => <motion.div key={i} className="absolute w-2 h-2 bg-white/20 rounded-full" animate={{
        y: [0, -100, 0],
        x: [0, Math.random() * 100 - 50, 0],
        opacity: [0, 1, 0]
      }} transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        delay: Math.random() * 2
      }} style={{
        left: `${Math.random() * 100}%`,
        top: '100%'
      }} />)}
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher onLanguageChange={() => setCurrentLanguage(getStoredLanguage())} />
      </div>

      {/* Enhanced Stats Bar */}
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }} className="absolute top-4 left-4 right-4 z-10">
        <Card className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-white/80">{t('totalEarned') || 'Total Earned'}:</span>
                <span className="text-green-400 font-bold">{totalEarned.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-white/80">{t('miningSpeed') || 'Speed'}:</span>
                <span className="text-yellow-400 font-bold">{miningSpeed}x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3D Logo with enhanced animations */}
      <motion.div initial={{
      scale: 0,
      rotateY: -180
    }} animate={{
      scale: 1,
      rotateY: 0
    }} transition={{
      duration: 1,
      ease: "easeOut"
    }} className="relative mt-16">
        <SpaceLogo3D size={1.2} className="w-96 h-48" />
        
        {(miningActive || autoMiningActive) && <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl" animate={{
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.7, 0.3],
        rotate: [0, 360]
      }} transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }} />}
      </motion.div>

      {/* Dynamic Phrases with enhanced styling */}
      <div className="text-center h-16 flex items-center px-4">
        <AnimatePresence mode="wait">
          <motion.h1 key={currentPhrase} initial={{
          y: 50,
          opacity: 0,
          scale: 0.8
        }} animate={{
          y: 0,
          opacity: 1,
          scale: 1
        }} exit={{
          y: -50,
          opacity: 0,
          scale: 0.8
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }} className="text-2xl md:text-3xl font-bold text-white text-center leading-tight">
            {formatSpaceText(currentPhrases[currentPhrase])}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Enhanced Mining Stats */}
      <motion.div initial={{
      opacity: 0,
      scale: 0.9
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.6,
      delay: 0.2
    }}>
        <Card className="bg-black/40 backdrop-blur-xl border-2 border-white/20 rounded-3xl overflow-hidden">
          <CardContent className="p-6 w-full max-w-md space-y-4 py-[3px]">
            {/* Balance Display */}
            <div className="text-center">
              <motion.div key={spaceCoins} initial={{
              scale: 1.1,
              opacity: 0
            }} animate={{
              scale: 1,
              opacity: 1
            }} transition={{
              duration: 0.3
            }} className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {spaceCoins.toLocaleString()} $SPACE
              </motion.div>
              <p className="text-white/60 text-sm">{t('spaceBalance') || 'Your Balance'}</p>
            </div>

            {/* Status Indicators */}
            <div className="space-y-3">
              {miningActive || autoMiningActive}

              {autoMiningActive && <div className="text-center p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-200 text-xs">
                    {t('autoMiningDesc') || 'Auto mining active - earning continuously'}
                  </p>
                </div>}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Action Buttons */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6,
      delay: 0.4
    }} className="space-y-3 w-full max-w-md px-4">
        {/* Main Mining Button */}
        <motion.div whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }}>
          <Button onClick={handleStartMining} disabled={miningActive || autoMiningActive} className={`w-full h-14 text-lg font-bold rounded-2xl transition-all duration-300 ${miningActive || autoMiningActive ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 cursor-not-allowed opacity-75' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30'}`}>
            {autoMiningActive ? <>
                <Crown className="w-5 h-5 mr-2" />
                {t('autoMining') || 'Auto Mining'} ⚡
              </> : miningActive ? <>
                <motion.div animate={{
              rotate: 360
            }} transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                {t('mining') || 'Mining'} • {formatTime(remainingTime)}
              </> : <>
                <Play className="w-5 h-5 mr-2" />
                {t('startMining') || 'Start Mining'}
              </>}
          </Button>
        </motion.div>

        {/* Upgrade Button */}
        <motion.div whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }}>
          <Button onClick={() => setShowUpgradeModal(true)} variant="outline" className="w-full h-12 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl backdrop-blur-sm">
            <Zap className="w-4 h-4 mr-2" />
            {t('upgrade') || 'Upgrade'}
          </Button>
        </motion.div>

        {/* Auto Mining Button */}
        <motion.div whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }}>
          <Button onClick={() => setShowAutoMiningModal(true)} variant="outline" disabled={autoMiningActive} className="w-full h-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-white hover:bg-yellow-500/30 rounded-xl backdrop-blur-sm">
            <Timer className="w-4 h-4 mr-2" />
            {t('autoMining') || 'Auto Mining'}
          </Button>
        </motion.div>

        <motion.div whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }}>
          <Button onClick={() => setShowBackgroundModal(true)} variant="outline" className="w-full h-12 bg-purple-500/20 border-purple-500/30 text-white hover:bg-purple-500/30 rounded-xl backdrop-blur-sm">
            <Palette className="w-4 h-4 mr-2" />
            {t('changeTheme') || 'Change Theme'}
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Modals */}
      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-xl border-2 border-white/20 text-white max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              {t('upgradeMiningSpeed') || 'Upgrade Mining Speed'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {UPGRADE_OPTIONS.map((upgrade, index) => <motion.div key={upgrade.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }}>
                <Button onClick={() => handlePurchaseUpgrade(upgrade)} disabled={isProcessing} className="w-full p-4 h-auto flex justify-between items-center bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-sm" variant="ghost">
                  <div className="text-left">
                    <div className="font-bold text-lg text-white">{upgrade.label}</div>
                    <div className="text-sm text-blue-200">
                      {upgrade.multiplier}x {t('fasterMining') || 'faster mining'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-400 text-lg">
                      {formatTON(upgrade.price)}
                    </div>
                  </div>
                </Button>
              </motion.div>)}
          </div>
        </DialogContent>
      </Dialog>

      {/* Auto Mining Modal */}
      <Dialog open={showAutoMiningModal} onOpenChange={setShowAutoMiningModal}>
        <DialogContent className="bg-gradient-to-br from-green-900/95 to-emerald-900/95 backdrop-blur-xl border-2 border-green-500/30 text-white max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-100 flex items-center justify-center gap-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              {t('autoMining') || 'Auto Mining'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 text-center">
            <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            delay: 0.2,
            type: "spring"
          }} className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Timer className="w-10 h-10 text-green-400" />
            </motion.div>
            
            <div>
              <p className="text-green-200 mb-4 leading-relaxed">
                {t('autoMiningDesc') || 'Enable automatic mining for 3 days. Your coins will be mined continuously without manual intervention.'}
              </p>
              <div className="text-4xl font-bold text-green-300 mb-2">
                {formatTON(0.5)}
              </div>
              <p className="text-green-200">
                {t('threeDaysDuration') || '3 Days Duration'}
              </p>
            </div>
            
            <motion.div whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              <Button onClick={handlePurchaseAutoMining} disabled={isProcessing} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-green-500/30">
                {isProcessing ? <>
                    <motion.div animate={{
                  rotate: 360
                }} transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                    {t('processing') || 'Processing...'}
                  </> : <>
                    <Crown className="w-5 h-5 mr-2" />
                    {t('purchaseAutoMining') || 'Purchase Auto Mining'}
                  </>}
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Background Modal */}
      <Dialog open={showBackgroundModal} onOpenChange={setShowBackgroundModal}>
        <DialogContent className="bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl border-2 border-purple-500/30 text-white max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-purple-100 flex items-center justify-center gap-2">
              <Palette className="w-6 h-6 text-pink-400" />
              {t('changeTheme') || 'Change Theme'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {BACKGROUND_OPTIONS.map((bg, index) => {
            const isUnlocked = unlockedBackgrounds.includes(bg.id);
            const isCurrent = currentBackground === bg.id;
            return <motion.div key={bg.id} initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: index * 0.1
            }} whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                  <Button onClick={() => handlePurchaseBackground(bg.id)} disabled={isCurrent || isProcessing && bg.price > 0} className={`w-full p-4 h-auto flex justify-between items-center border border-white/20 rounded-xl backdrop-blur-sm transition-all ${isCurrent ? 'bg-green-600/50 hover:bg-green-600/50 border-green-400/50' : isUnlocked ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30' : 'bg-white/10 hover:bg-white/20'}`} variant="ghost">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${bg.gradient} border-2 border-white/30`}></div>
                      <div className="text-left">
                        <div className="font-bold text-lg text-white">{bg.name}</div>
                        {isCurrent && <div className="text-sm text-green-200 flex items-center gap-1">
                            <motion.div animate={{
                        scale: [1, 1.2, 1]
                      }} transition={{
                        duration: 1,
                        repeat: Infinity
                      }} className="w-2 h-2 bg-green-400 rounded-full" />
                            {t('currentBackground') || 'Current'}
                          </div>}
                        {isUnlocked && !isCurrent && <div className="text-sm text-blue-200">
                            {t('unlocked') || 'Unlocked'}
                          </div>}
                      </div>
                    </div>
                    <div className="text-right">
                      {bg.price === 0 || isUnlocked ? <span className="text-green-400 font-bold text-lg">
                          {isCurrent ? '✓' : t('select') || 'Select'}
                        </span> : <div className="font-bold text-purple-300 text-lg">
                          {formatTON(bg.price)}
                        </div>}
                    </div>
                  </Button>
                </motion.div>;
          })}
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default MiningPage;