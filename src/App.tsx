
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import SplashScreen from './components/SplashScreen';
import MiningPage from './components/MiningPage';
import TasksPage from './components/TasksPage';
import WalletPage from './components/WalletPage';
import ReferralPage from './components/ReferralPage';
import StorePage from './components/StorePage';
import CoursesPage from './components/CoursesPage';
import TaskAdminPage from './components/TaskAdminPage';
import DailyRushPage from './components/DailyRushPage';
import UsernameModal from './components/UsernameModal';
import { Button } from '@/components/ui/button';
import { Home, CheckSquare, Wallet, Users, Settings, ShoppingBag, GraduationCap, Crown } from 'lucide-react';
import { getTranslation } from './utils/language';

const queryClient = new QueryClient();
type Page = 'mining' | 'tasks' | 'wallet' | 'referral' | 'store' | 'courses' | 'admin' | 'daily-rush';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('mining');
  const [showAdminAccess, setShowAdminAccess] = useState(false);
  const [taskClickCount, setTaskClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Always show splash screen on app load
    setShowSplash(true);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      // Check if username is already saved
      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        setUsername(savedUsername);
      } else {
        setShowUsernameModal(true);
      }
    }
  }, [showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
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

  useEffect(() => {
    if (taskClickCount > 0) {
      const timer = setTimeout(() => {
        setTaskClickCount(0);
        setLastClickTime(0);
      }, 2000); // Reset after 2 seconds of no clicks
      return () => clearTimeout(timer);
    }
  }, [taskClickCount]);

  const handleUsernameComplete = (newUsername: string) => {
    setUsername(newUsername);
    setShowUsernameModal(false);
  };

  const handleTaskButtonClick = () => {
    const currentTime = Date.now();
    
    // If more than 500ms passed since last click, reset counter
    if (currentTime - lastClickTime > 500) {
      setTaskClickCount(1);
    } else {
      const newCount = taskClickCount + 1;
      setTaskClickCount(newCount);
      
      if (newCount >= 5) {
        setCurrentPage('admin');
        setShowAdminAccess(true);
        setTaskClickCount(0);
        setLastClickTime(0);
        return;
      }
    }
    
    setLastClickTime(currentTime);
    
    // If less than 5 clicks, go to tasks page
    if (taskClickCount < 5) {
      setCurrentPage('tasks');
    }
  };

  const navigationItems = [{
    id: 'mining',
    label: getTranslation('mining'),
    icon: Home
  }, {
    id: 'tasks',
    label: getTranslation('tasks'),
    icon: CheckSquare
  }, {
    id: 'daily-rush',
    label: 'Daily Rush',
    icon: Crown
  }, {
    id: 'courses',
    label: 'Courses',
    icon: GraduationCap
  }, {
    id: 'store',
    label: 'Store',
    icon: ShoppingBag
  }, {
    id: 'wallet',
    label: getTranslation('wallet'),
    icon: Wallet
  }, {
    id: 'referral',
    label: getTranslation('friends'),
    icon: Users
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
      case 'daily-rush':
        return <DailyRushPage />;
      case 'courses':
        return <CoursesPage />;
      case 'store':
        return <StorePage />;
      case 'wallet':
        return <WalletPage />;
      case 'referral':
        return <ReferralPage />;
      case 'admin':
        return showAdminAccess ? <TaskAdminPage /> : <MiningPage />;
      default:
        return <MiningPage />;
    }
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <TonConnectUIProvider manifestUrl={window.location.origin + '/tonconnect-manifest.json'}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner 
            position="top-center"
            duration={1000}
            toastOptions={{
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                color: 'white',
                borderRadius: '6px',
                fontSize: '12px',
                maxWidth: '280px',
                padding: '8px 12px',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
              },
            }}
          />
          
          <div className={`min-h-screen flex flex-col ${currentPage === 'mining' ? 'overflow-hidden' : ''}`}>
            <div className="flex-1 pb-16">
              {renderCurrentPage()}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/20 p-2 z-50">
              <div className="max-w-md mx-auto">
                <div className={`grid gap-1 ${showAdminAccess ? 'grid-cols-8' : 'grid-cols-7'}`}>
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
                        className={`flex flex-col items-center gap-0.5 h-auto py-1.5 px-1 text-xs ${
                          currentPage === item.id
                            ? 'text-pink-400 bg-pink-400/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs leading-tight">{item.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Username Modal */}
          <UsernameModal 
            isOpen={showUsernameModal} 
            onComplete={handleUsernameComplete} 
          />
        </TooltipProvider>
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
};

export default App;
