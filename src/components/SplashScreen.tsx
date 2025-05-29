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
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0); // 0: logo, 1: greeting, 2: tagline, 3: loading

  useEffect(() => {
    // Progress simulation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    // Phase transitions
    const phaseTimer1 = setTimeout(() => setCurrentPhase(1), 800);
    const phaseTimer2 = setTimeout(() => setCurrentPhase(2), 2000);
    const phaseTimer3 = setTimeout(() => setCurrentPhase(3), 3200);

    // Greeting rotation
    const greetingInterval = setInterval(() => {
      setGreetingIndex(prev => (prev + 1) % SUPPORTED_LANGUAGES.length);
    }, 600);

    // Complete splash
    const completeTimer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(onComplete, 800);
    }, 5000);
    return () => {
      clearInterval(progressInterval);
      clearInterval(greetingInterval);
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      clearTimeout(phaseTimer3);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);
  const starsVariants = {
    animate: {
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };
  const planetVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };
  return <AnimatePresence>
      {showSplash && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0,
      scale: 1.1
    }} transition={{
      duration: 0.8
    }} className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden" style={{
      background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0f0a1f 40%, #000000 100%)'
    }}>
          {/* Enhanced Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Moving Stars */}
            {[...Array(100)].map((_, i) => <motion.div key={`star-${i}`} className="absolute w-1 h-1 bg-white rounded-full" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }} variants={starsVariants} animate="animate" custom={i} transition={{
          delay: Math.random() * 3
        }} />)}

            {/* Floating Planets */}
            {[...Array(5)].map((_, i) => <motion.div key={`planet-${i}`} className={`absolute rounded-full opacity-20 ${i % 3 === 0 ? 'bg-blue-500' : i % 3 === 1 ? 'bg-purple-500' : 'bg-pink-500'}`} style={{
          width: `${20 + Math.random() * 40}px`,
          height: `${20 + Math.random() * 40}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }} variants={planetVariants} animate="animate" transition={{
          delay: i * 0.5
        }} />)}

            {/* Cosmic Rays */}
            {[...Array(8)].map((_, i) => <motion.div key={`ray-${i}`} className="absolute bg-gradient-to-r from-transparent via-blue-400 to-transparent h-0.5 opacity-30" style={{
          width: '200px',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          transform: `rotate(${Math.random() * 360}deg)`
        }} animate={{
          opacity: [0, 0.6, 0],
          scale: [0.5, 1, 0.5]
        }} transition={{
          duration: 4,
          repeat: Infinity,
          delay: Math.random() * 2
        }} />)}
          </div>

          {/* Logo Section */}
          <AnimatePresence>
            {currentPhase >= 0 && <motion.div initial={{
          scale: 0,
          rotateY: -180,
          opacity: 0
        }} animate={{
          scale: 1,
          rotateY: 0,
          opacity: 1
        }} exit={{
          scale: 0.8,
          opacity: 0.8
        }} transition={{
          duration: 1.2,
          ease: "easeOut",
          type: "spring",
          stiffness: 100
        }} className="relative mb-8">
                {/* Glow Effect */}
                <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl" animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3]
          }} transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }} />
                
                <SpaceLogo3D size={1.0} className="w-80 h-32 relative z-10" />
                
                {/* Orbital Rings */}
                <motion.div className="absolute inset-0 border border-blue-400/30 rounded-full" animate={{
            rotate: 360
          }} transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }} style={{
            margin: '-20px'
          }} />
                <motion.div className="absolute inset-0 border border-purple-400/20 rounded-full" animate={{
            rotate: -360
          }} transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }} style={{
            margin: '-40px'
          }} />
              </motion.div>}
          </AnimatePresence>

          {/* Greeting Section */}
          <AnimatePresence>
            {currentPhase >= 1 && <motion.div initial={{
          y: 50,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} exit={{
          y: -20,
          opacity: 0
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }} className="text-center mb-6 h-20 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.h1 key={greetingIndex} initial={{
              y: 30,
              opacity: 0,
              scale: 0.8
            }} animate={{
              y: 0,
              opacity: 1,
              scale: 1
            }} exit={{
              y: -30,
              opacity: 0,
              scale: 0.8
            }} transition={{
              duration: 0.6,
              ease: "easeOut"
            }} className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" style={{
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 3s ease infinite'
            }}>
                    {SUPPORTED_LANGUAGES[greetingIndex].greeting}
                  </motion.h1>
                </AnimatePresence>
              </motion.div>}
          </AnimatePresence>

          {/* Tagline Section */}
          <AnimatePresence>
            {currentPhase >= 2 && <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -10
        }} transition={{
          duration: 0.8,
          delay: 0.3
        }} className="text-center mb-8">
                
                
                <motion.div initial={{
            width: 0
          }} animate={{
            width: '100%'
          }} transition={{
            duration: 1,
            delay: 0.5
          }} className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-4 max-w-xs" />
              </motion.div>}
          </AnimatePresence>

          {/* Enhanced Loading Section */}
          <AnimatePresence>
            {currentPhase >= 3}
          </AnimatePresence>
        </motion.div>}
      
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </AnimatePresence>;
};
export default SplashScreen;