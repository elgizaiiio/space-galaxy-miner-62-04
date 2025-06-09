
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import OnboardingTutorial from './components/OnboardingTutorial';
import MiningPage from './components/MiningPage';
import TasksPage from './components/TasksPage';
import WalletPage from './components/WalletPage';
import ReferralPage from './components/ReferralPage';
import SubscriptionPage from './components/SubscriptionPage';
import TaskAdminPage from './components/TaskAdminPage';
import { Button } from '@/components/ui/button';
import { Home, CheckSquare, Wallet, Users, Crown, Settings } from 'lucide-react';
import { getStoredLanguage, getTranslation } from './utils/language';

const queryClient = new QueryClient();
type AppState = 'onboarding' | 'main';
type Page = 'mining' | 'tasks' | 'wallet' | 'referral' | 'subscription' | 'admin';

const App = () => {
  const [appState, setAppState] = useState<AppState>('main');
  const [currentPage, setCurrentPage] = useState<Page>('mining');
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [taskClickCount, setTaskClickCount] = useState(0);

  useEffect(() => {
    setCurrentLanguage(getStoredLanguage());
    
    // Check if onboarding should be shown
    const onboardingCompleted = localStorage.getItem('space-onboarding-completed');
    if (!onboardingCompleted) {
      setAppState('onboarding');
    }

    let clickCount = 0;
    const handleLogoClick = () => {
      clickCount++;
      if (clickCount === 3) {
        setShowAdminAccess(true);
        clickCount = 0;
      }
      setTimeout(() => {
        clickCount = 0;
      }, 2000);
    };
    const logoElement = document.querySelector('.admin-access-trigger');
    if (logoElement) {
      logoElement.addEventListener('click', handleLogoClick);
    }
    return () => {
      if (logoElement) {
        logoElement.removeEventListener('click', handleLogoClick);
      }
    };
  }, []);

  // Reset task click count after 2 seconds
  useEffect(() => {
    if (taskClickCount > 0) {
      const timer = setTimeout(() => {
        setTaskClickCount(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [taskClickCount]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('space-onboarding-completed', 'true');
    setAppState('main');
  };

  const handleTaskButtonClick = () => {
    const newCount = taskClickCount + 1;
    setTaskClickCount(newCount);
    if (newCount === 3) {
      setCurrentPage('admin');
      setShowAdminAccess(true);
      setTaskClickCount(0);
    } else {
      setCurrentPage('tasks');
    }
  };

  const t = (key: string) => getTranslation(key, currentLanguage.code);

  const navigationItems = [{
    id: 'mining',
    label: t('mining'),
    icon: Home
  }, {
    id: 'tasks',
    label: t('tasks'),
    icon: CheckSquare
  }, {
    id: 'wallet',
    label: t('wallet'),
    icon: Wallet
  }, {
    id: 'referral',
    label: t('friends'),
    icon: Users
  }, {
    id: 'subscription',
    label: t('premium'),
    icon: Crown
  }];

  if (showAdminAccess) {
    navigationItems.push({
      id: 'admin',
      label: 'Admin',
      icon: Settings
    });
  }

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
      case 'subscription':
        return <SubscriptionPage />;
      case 'admin':
        return showAdminAccess ? <TaskAdminPage /> : <MiningPage />;
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
          
          {appState === 'onboarding' && (
            <OnboardingTutorial onComplete={handleOnboardingComplete} />
          )}
          
          {appState === 'main' && (
            <div className="min-h-screen flex flex-col">
              <div className="flex-1 pb-20">
                {renderCurrentPage()}
              </div>

              <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/20 p-4 z-50">
                <div className="max-w-md mx-auto">
                  <div className={`grid gap-2 ${showAdminAccess ? 'grid-cols-6' : 'grid-cols-5'}`}>
                    {navigationItems.map(item => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          onClick={() => {
                            if (item.id === 'tasks') {
                              handleTaskButtonClick();
                            } else {
                              setCurrentPage(item.id as Page);
                            }
                          }}
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
