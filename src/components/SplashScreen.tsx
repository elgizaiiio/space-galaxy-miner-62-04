
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpaceLogo3D from './SpaceLogo3D';
import { detectLanguage, SUPPORTED_LANGUAGES, type Language } from '../utils/language';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(detectLanguage());
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Greeting rotation
    const interval = setInterval(() => {
      setGreetingIndex(prev => (prev + 1) % SUPPORTED_LANGUAGES.length);
    }, 800);

    // Loading progress animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 10;
      });
    }, 150);

    // Complete splash screen
    const timer = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        setShowSplash(false);
        setTimeout(onComplete, 600);
      }, 500);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cosmic-gradient overflow-hidden"
        >
          {/* Enhanced Background with multiple layers */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-pink-900/30"
              animate={{
                background: [
                  'linear-gradient(45deg, rgba(139, 92, 246, 0.3), transparent, rgba(236, 72, 153, 0.3))',
                  'linear-gradient(225deg, rgba(236, 72, 153, 0.3), transparent, rgba(139, 92, 246, 0.3))',
                  'linear-gradient(45deg, rgba(139, 92, 246, 0.3), transparent, rgba(236, 72, 153, 0.3))'
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {/* Enhanced Stars with different sizes */}
            {[...Array(80)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full ${
                  i % 4 === 0 ? 'w-2 h-2 bg-pink-300' : 
                  i % 4 === 1 ? 'w-1.5 h-1.5 bg-purple-300' :
                  i % 4 === 2 ? 'w-1 h-1 bg-blue-300' : 'w-0.5 h-0.5 bg-white'
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [-20, 20, -20],
                  x: [-10, 10, -10],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Main Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-6">
            
            {/* Enhanced 3D Logo with glow effect */}
            <motion.div
              initial={{ scale: 0, rotateY: -180, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="mb-8 relative"
            >
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl scale-150 rounded-full" />
              <SpaceLogo3D size={0.9} className="w-80 h-40 relative z-10" />
            </motion.div>

            {/* Enhanced Brand Name */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-6"
            >
              <motion.h1
                className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-wider"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                space.coin
              </motion.h1>
            </motion.div>

            {/* Animated Greetings with enhanced styling */}
            <motion.div
              className="text-center mb-8 h-16"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <AnimatePresence mode="wait">
                <motion.h2
                  key={greetingIndex}
                  initial={{ y: 30, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -30, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="text-3xl md:text-4xl font-semibold text-white/90 mb-2"
                >
                  {SUPPORTED_LANGUAGES[greetingIndex].greeting}
                </motion.h2>
              </AnimatePresence>
            </motion.div>

            {/* Enhanced Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/70 text-center max-w-lg px-4 mb-12 leading-relaxed"
            >
              استكشف مجرة المكافآت
            </motion.p>

            {/* Enhanced Loading Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="flex flex-col items-center space-y-6"
            >
              {/* Loading Progress Bar */}
              <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Loading Percentage */}
              <motion.div
                className="text-white/60 text-sm font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {Math.round(loadingProgress)}% جاري التحميل...
              </motion.div>

              {/* Enhanced Loading Dots */}
              <div className="flex space-x-3">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: 'linear-gradient(45deg, #ec4899, #8b5cf6)'
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
