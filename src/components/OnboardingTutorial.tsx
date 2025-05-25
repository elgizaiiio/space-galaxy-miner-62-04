
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SpaceLogo3D from './SpaceLogo3D';

interface OnboardingStep {
  title: string;
  description: string;
  icon: string;
  details: string[];
}

interface OnboardingTutorialProps {
  onComplete: () => void;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to $SPACE Mining',
    description: 'Start your journey in the galaxy of rewards',
    icon: '🚀',
    details: [
      'Mine $SPACE cryptocurrency',
      'Earn rewards every second',
      'Upgrade your mining speed',
      'Invite friends for bonuses'
    ]
  },
  {
    title: 'Connect Your Wallet',
    description: 'Link your TON wallet to start mining',
    icon: '💼',
    details: [
      'Secure TON Connect integration',
      'Your funds stay in your wallet',
      'Real blockchain transactions',
      'Full control of your assets'
    ]
  },
  {
    title: 'Mining System',
    description: 'Understand how mining works',
    icon: '⛏️',
    details: [
      'Click to start mining',
      'Automatic coin generation',
      'Upgrade for faster mining',
      'Collect rewards anytime'
    ]
  },
  {
    title: 'Upgrade Your Speed',
    description: 'Boost your mining power with TON',
    icon: '⚡',
    details: [
      'Pay with real TON',
      'Instant speed multipliers',
      'Up to 120x mining speed',
      'Permanent upgrades'
    ]
  },
  {
    title: 'Referral Program',
    description: 'Earn more by inviting friends',
    icon: '👥',
    details: [
      'Share your referral link',
      'Earn from friend activity',
      'Climb the leaderboard',
      'Unlock special bonuses'
    ]
  },
  {
    title: 'Complete Tasks',
    description: 'Finish missions for extra rewards',
    icon: '🎯',
    details: [
      'Daily check-in bonuses',
      'Social media tasks',
      'Special challenges',
      'Mini-games and more'
    ]
  }
];

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setShowTutorial(false);
    localStorage.setItem('space-onboarding-completed', 'true');
    setTimeout(onComplete, 300);
  };

  const currentStepData = ONBOARDING_STEPS[currentStep];

  return (
    <AnimatePresence>
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-cosmic-gradient p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="w-full max-w-md"
          >
            <Card className="glass-card p-6 text-center">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">Progress</span>
                  <span className="text-sm text-white/70">
                    {currentStep + 1}/{ONBOARDING_STEPS.length}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-space-pink to-space-blue h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-6xl mb-4">{currentStepData.icon}</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {currentStepData.title}
                  </h2>
                  <p className="text-white/80 mb-6">
                    {currentStepData.description}
                  </p>

                  <div className="space-y-2 mb-8">
                    {currentStepData.details.map((detail, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="flex items-center text-left text-white/80"
                      >
                        <div className="w-2 h-2 bg-space-pink rounded-full mr-3 flex-shrink-0" />
                        {detail}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 space-button"
                >
                  {currentStep === ONBOARDING_STEPS.length - 1 ? 'Got it!' : 'Next'}
                </Button>
              </div>

              {/* Step Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {ONBOARDING_STEPS.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-space-pink' : 'bg-white/30'
                    }`}
                    animate={{
                      scale: index === currentStep ? 1.2 : 1,
                    }}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTutorial;
