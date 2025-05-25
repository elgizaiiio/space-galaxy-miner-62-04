
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SpaceLogo3D from './SpaceLogo3D';
import LanguageSwitcher from './LanguageSwitcher';
import { UPGRADE_OPTIONS, formatTON, type UpgradeOption } from '../utils/ton';
import { hapticFeedback } from '../utils/telegram';
import { getStoredLanguage, getTranslation } from '../utils/language';

const MINING_PHRASES = {
  en: ['Mine $SPACE Coin', 'Start Earning Now', 'Explore the Galaxy of Rewards', 'Begin Your Space Mining Journey', 'Collect Cosmic Treasures', 'Unlock Universal Wealth'],
  ar: ['عدن عملة $SPACE', 'ابدأ الكسب الآن', 'استكشف مجرة المكافآت', 'ابدأ رحلة التعدين الفضائية', 'اجمع الكنوز الكونية', 'افتح الثروة الكونية'],
  ru: ['Добывайте $SPACE монеты', 'Начните зарабатывать сейчас', 'Исследуйте галактику наград', 'Начните космическое путешествие майнинга', 'Собирайте космические сокровища', 'Откройте вселенское богатство'],
  zh: ['挖掘$SPACE币', '立即开始赚钱', '探索奖励银河', '开始太空挖矿之旅', '收集宇宙宝藏', '解锁宇宙财富'],
  hi: ['$SPACE सिक्का माइन करें', 'अभी कमाना शुरू करें', 'पुरस्कारों की आकाशगंगा का अन्वेषण करें', 'अपनी स्पेस माइनिंग यात्रा शुरू करें', 'ब्रह्मांडीय खजाने इकट्ठा करें', 'सार्वभौमिक धन अनलॉक करें'],
  es: ['Mina monedas $SPACE', 'Comienza a ganar ahora', 'Explora la galaxia de recompensas', 'Comienza tu viaje de minería espacial', 'Recolecta tesoros cósmicos', 'Desbloquea riqueza universal'],
  fr: ['Minez des pièces $SPACE', 'Commencez à gagner maintenant', 'Explorez la galaxie des récompenses', 'Commencez votre voyage de minage spatial', 'Collectez des trésors cosmiques', 'Débloquez la richesse universelle'],
  de: ['Mine $SPACE Münzen', 'Beginne jetzt zu verdienen', 'Erkunde die Galaxie der Belohnungen', 'Beginne deine Weltraum-Mining-Reise', 'Sammle kosmische Schätze', 'Entsperre universellen Reichtum'],
  ja: ['$SPACEコインをマイニング', '今すぐ稼ぎ始める', '報酬の銀河を探索', '宇宙マイニングの旅を始める', '宇宙の宝物を集める', '宇宙の富をアンロック'],
  tr: ['$SPACE Coin madenciliği yap', 'Şimdi kazanmaya başla', 'Ödüller galaksisini keşfet', 'Uzay madencilik yolculuğuna başla', 'Kozmik hazineler topla', 'Evrensel zenginliği aç'],
  pt: ['Mine moedas $SPACE', 'Comece a ganhar agora', 'Explore a galáxia de recompensas', 'Comece sua jornada de mineração espacial', 'Colete tesouros cósmicos', 'Desbloqueie riqueza universal'],
  uk: ['Добувайте монети $SPACE', 'Почніть заробляти зараз', 'Досліджуйте галактику нагород', 'Розпочніть свою космічну подорож майнінгу', 'Збирайте космічні скарби', 'Відкрийте універсальне багатство']
};

const MINING_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

const MiningPage: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [miningActive, setMiningActive] = useState(false);
  const [spaceCoins, setSpaceCoins] = useState(0);
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(true); // Simplified - always connected
  const [miningEndTime, setMiningEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  // Get translation function for current language
  const t = (key: string) => getTranslation(key, currentLanguage.code);

  // Get phrases for current language
  const currentPhrases = MINING_PHRASES[currentLanguage.code as keyof typeof MINING_PHRASES] || MINING_PHRASES.en;

  // Update language when it changes
  useEffect(() => {
    setCurrentLanguage(getStoredLanguage());
  }, []);

  // Rotate phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase(prev => (prev + 1) % currentPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentPhrases.length]);

  // Check for existing mining session on component mount
  useEffect(() => {
    const savedEndTime = localStorage.getItem('miningEndTime');
    const savedActive = localStorage.getItem('miningActive');
    
    if (savedEndTime && savedActive === 'true') {
      const endTime = parseInt(savedEndTime);
      const now = Date.now();
      
      if (now < endTime) {
        setMiningActive(true);
        setMiningEndTime(endTime);
        setRemainingTime(endTime - now);
      } else {
        // Mining session expired
        localStorage.removeItem('miningEndTime');
        localStorage.removeItem('miningActive');
      }
    }
  }, []);

  // Update remaining time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (miningActive && miningEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = miningEndTime - now;
        
        if (remaining <= 0) {
          // Mining completed
          setMiningActive(false);
          setMiningEndTime(null);
          setRemainingTime(0);
          localStorage.removeItem('miningEndTime');
          localStorage.removeItem('miningActive');
        } else {
          setRemainingTime(remaining);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [miningActive, miningEndTime]);

  // Mining logic for coins
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (miningActive && isWalletConnected) {
      interval = setInterval(() => {
        setSpaceCoins(prev => prev + miningSpeed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [miningActive, isWalletConnected, miningSpeed]);

  const handleStartMining = () => {
    if (!miningActive) {
      // Start mining
      const endTime = Date.now() + MINING_DURATION;
      setMiningActive(true);
      setMiningEndTime(endTime);
      setRemainingTime(MINING_DURATION);
      
      // Save to localStorage
      localStorage.setItem('miningEndTime', endTime.toString());
      localStorage.setItem('miningActive', 'true');
      
      hapticFeedback('success');
    } else {
      // Stop mining
      setMiningActive(false);
      setMiningEndTime(null);
      setRemainingTime(0);
      
      // Clear localStorage
      localStorage.removeItem('miningEndTime');
      localStorage.removeItem('miningActive');
      
      hapticFeedback('light');
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
    hapticFeedback('light');
  };

  const handlePurchaseUpgrade = (upgrade: UpgradeOption) => {
    setMiningSpeed(upgrade.multiplier);
    setShowUpgradeModal(false);
    hapticFeedback('success');
  };

  const formatTime = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex flex-col items-center justify-center p-4 space-y-8">
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
        {miningActive && (
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
          className={`w-full space-button ${miningActive ? 'animate-pulse-glow' : ''}`} 
          size="lg"
        >
          {miningActive 
            ? `${t('stopMining') || 'Stop Mining'} (${formatTime(remainingTime)})` 
            : t('startMining') || 'Start Mining'
          }
        </Button>

        <Button 
          onClick={handleUpgradeClick} 
          variant="outline" 
          className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20" 
          size="lg"
        >
          {t('upgradeMiningSpeed') || 'Upgrade Mining Speed'}
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
    </div>
  );
};

export default MiningPage;
