
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import AuthPage from './components/AuthPage';
import SplashScreen from './components/SplashScreen';
import OnboardingTutorial from './components/OnboardingTutorial';
import MiningPage from './components/MiningPage';
import TasksPage from './components/TasksPage';
import WalletPage from './components/WalletPage';
import ReferralPage from './components/ReferralPage';
import { Button } from '@/components/ui/button';
import { Home, CheckSquare, Wallet, Users, LogOut } from 'lucide-react';

const queryClient = new QueryClient();

type AppState = 'splash' | 'onboarding' | 'auth' | 'main';
type Page = 'mining' | 'tasks' | 'wallet' | 'referral';

const AppContent = () => {
  const { user, loading, signOut } = useAuth();
  const [appState, setAppState] = useState<AppState>('splash');
  const [currentPage, setCurrentPage] = useState<Page>('mining');

  useEffect(() => {
    if (!loading) {
      if (user) {
        const onboardingCompleted = localStorage.getItem('space-onboarding-completed');
        setAppState(onboardingCompleted ? 'main' : 'onboarding');
      } else {
        setAppState('auth');
      }
    }
  }, [user, loading]);

  const handleSplashComplete = () => {
    if (user) {
      const onboardingCompleted = localStorage.getItem('space-onboarding-completed');
      setAppState(onboardingCompleted ? 'main' : 'onboarding');
    } else {
      setAppState('auth');
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('space-onboarding-completed', 'true');
    setAppState('main');
  };

  const handleAuthSuccess = () => {
    const onboardingCompleted = localStorage.getItem('space-onboarding-completed');
    setAppState(onboardingCompleted ? 'main' : 'onboarding');
  };

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('space-onboarding-completed');
    setAppState('auth');
  };

  const navigationItems = [
    { id: 'mining', label: 'التعدين', icon: Home },
    { id: 'tasks', label: 'المهام', icon: CheckSquare },
    { id: 'wallet', label: 'المحفظة', icon: Wallet },
    { id: 'referral', label: 'الأصدقاء', icon: Users },
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <>
      {appState === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      
      {appState === 'auth' && (
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      )}
      
      {appState === 'onboarding' && (
        <OnboardingTutorial onComplete={handleOnboardingComplete} />
      )}
      
      {appState === 'main' && (
        <div className="min-h-screen flex flex-col">
          {/* Header with logout */}
          <div className="absolute top-4 right-4 z-50">
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30"
            >
              <LogOut className="w-4 h-4 mr-2" />
              تسجيل خروج
            </Button>
          </div>

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
    </>
  );
};

const App = () => {
  return (
    <TonConnectUIProvider manifestUrl={window.location.origin + '/tonconnect-manifest.json'}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
};

export default App;
