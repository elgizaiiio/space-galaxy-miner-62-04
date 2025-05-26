import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SpaceLogo3D from './SpaceLogo3D';
import { detectLanguage, SUPPORTED_LANGUAGES, type Language } from '../utils/language';
interface SplashScreenProps {
  onComplete: () => void;
}
const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(detectLanguage());
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex(prev => (prev + 1) % SUPPORTED_LANGUAGES.length);
    }, 800);
    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(onComplete, 500);
    }, 4000);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onComplete]);
  return <AnimatePresence>
      {showSplash && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0,
      scale: 1.1
    }} transition={{
      duration: 0.5
    }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cosmic-gradient">
          {/* Animated Background Stars */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => <motion.div key={i} className="absolute w-1 h-1 bg-white rounded-full" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }} animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity,
          delay: Math.random() * 2
        }} />)}
          </div>

          {/* 3D Logo */}
          <motion.div initial={{
        scale: 0,
        rotateY: -180
      }} animate={{
        scale: 1,
        rotateY: 0
      }} transition={{
        duration: 1,
        ease: "easeOut"
      }} className="mb-8">
            <SpaceLogo3D size={0.8} className="w-80 h-40" />
          </motion.div>

          {/* Animated Greetings */}
          <motion.div className="text-center mb-8" initial={{
        y: 50,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        delay: 0.5,
        duration: 0.8
      }}>
            <AnimatePresence mode="wait">
              <motion.h1 key={greetingIndex} initial={{
            y: 20,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} exit={{
            y: -20,
            opacity: 0
          }} transition={{
            duration: 0.5
          }} className="text-4xl font-bold bg-clip-text bg-space-gradient mb-2 text-slate-50">
                {SUPPORTED_LANGUAGES[greetingIndex].greeting}
              </motion.h1>
            </AnimatePresence>
            <p className="text-xl text-white/80">
              {SUPPORTED_LANGUAGES[greetingIndex].flag} {SUPPORTED_LANGUAGES[greetingIndex].name}
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1,
        duration: 0.8
      }} className="text-lg text-white/70 text-center max-w-md px-4">
            Explore the Galaxy of Rewards
          </motion.p>

          {/* Loading Animation */}
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.5,
        duration: 0.5
      }} className="mt-8 flex space-x-2">
            {[...Array(3)].map((_, i) => <motion.div key={i} className="w-3 h-3 bg-space-pink rounded-full" animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }} transition={{
          duration: 1,
          repeat: Infinity,
          delay: i * 0.2
        }} />)}
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
};
export default SplashScreen;