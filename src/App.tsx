
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import SplashScreen from './components/SplashScreen';
import OnboardingTutorial from './components/OnboardingTutorial';
import MiningPage from './components/MiningPage';
import TasksPage from './components/TasksPage';
import WalletPage from './components/WalletPage';
import ReferralPage from './components/ReferralPage';
import { Button } from '@/components/ui/button';
import { Home, CheckSquare, Wallet, Users } from 'lucide-react';
import { getStoredLanguage, getTranslation } from './utils/language';

const queryClient = new QueryClient();

type AppState = 'splash' | 'onboarding' | 'main';
type Page = 'mining' | 'tasks' | 'wallet' | 'referral';

const App = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [currentPage, setCurrentPage] = useState<Page>('mining');
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());

  useEffect(() => {
    // Update language when it changes
    setCurrentLanguage(getStoredLanguage());
  }, []);

  const handleSplashComplete = () => {
    const onboardingCompleted = localStorage.getItem('space-onboarding-completed');
    setAppState(onboardingCompleted ? 'main' : 'onboarding');
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('space-onboarding-completed', 'true');
    setAppState('main');
  };

  const t = (key: string) => getTranslation(key, currentLanguage.code);

  const navigationItems = [
    { id: 'mining', label: t('mining'), icon: Home },
    { id: 'tasks', label: t('tasks'), icon: CheckSquare },
    { id: 'wallet', label: t('wallet'), icon: Wallet },
    { id: 'referral', label: t('friends'), icon: Users },
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'mining':
        return <MiningPage />;
      case 'tasks':
        return <TasksPage />;
      case 'wallet':
        return <WalletPage />;
      case 'referral':
        return <ReferralPage />;
      default:
        return <MiningPage />;
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
            <div className="min-h-screen flex flex-col">
              {/* Main Content */}
              <div className="flex-1 pb-20">
                {renderCurrentPage()}
              </div>

              {/* Bottom Navigation */}
              <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/20 p-4 z-50">
                <div className="max-w-md mx-auto">
                  <div className="grid grid-cols-4 gap-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          onClick={() => setCurrentPage(item.id as Page)}
                          className={`flex flex-col items-center gap-1 h-auto py-2 px-2 text-xs ${
                            currentPage === item.id
                              ? 'text-pink-400 bg-pink-400/20'
                              : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                          <span>{item.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
};

export default App;
