
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import SplashScreen from './components/SplashScreen';
import OnboardingTutorial from './components/OnboardingTutorial';
import MiningPage from './components/MiningPage';
import { initTelegramWebApp, getTelegramUser } from './utils/telegram';
import { createTonConnector, type UpgradeOption } from './utils/ton';
import { useToast } from '@/hooks/use-toast';

const queryClient = new QueryClient();

type AppState = 'splash' | 'onboarding' | 'main';

const App = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Telegram WebApp
    const webApp = initTelegramWebApp();
    const user = getTelegramUser();
    
    console.log('Telegram WebApp initialized:', { webApp, user });

    // Check if onboarding was completed
    const onboardingCompleted = localStorage.getItem('space-onboarding-completed');
    if (onboardingCompleted && appState === 'splash') {
      // Skip onboarding if already completed
    }
  }, []);

  const handleSplashComplete = () => {
    const onboardingCompleted = localStorage.getItem('space-onboarding-completed');
    setAppState(onboardingCompleted ? 'main' : 'onboarding');
  };

  const handleOnboardingComplete = () => {
    setAppState('main');
  };

  const handleConnectWallet = async () => {
    try {
      // In a real implementation, this would use TON Connect
      toast({
        title: "Wallet Connection",
        description: "TON Connect integration will be implemented with proper manifest",
      });
      setIsWalletConnected(true);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePurchaseUpgrade = async (upgrade: UpgradeOption) => {
    try {
      toast({
        title: "Processing Payment",
        description: `Purchasing ${upgrade.label} for ${upgrade.price} TON...`,
      });
      
      // In a real implementation, this would process the TON payment
      setTimeout(() => {
        toast({
          title: "Upgrade Successful!",
          description: `Your mining speed is now ${upgrade.multiplier}x faster!`,
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <TonConnectUIProvider manifestUrl={window.location.origin + '/tonconnect-manifest.json'}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {appState === 'splash' && (
            <SplashScreen onComplete={handleSplashComplete} />
          )}
          
          {appState === 'onboarding' && (
            <OnboardingTutorial onComplete={handleOnboardingComplete} />
          )}
          
          {appState === 'main' && (
            <MiningPage
              isWalletConnected={isWalletConnected}
              onConnectWallet={handleConnectWallet}
              onPurchaseUpgrade={handlePurchaseUpgrade}
            />
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
};

export default App;
