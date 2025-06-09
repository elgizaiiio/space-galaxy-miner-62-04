
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Eye, EyeOff, RefreshCw, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { tonService, type TONTransaction } from '../services/tonService';
import { getTranslation } from '../utils/language';
import SendModal from './SendModal';
import ReceiveModal from './ReceiveModal';

const WalletPage = () => {
  const { toast } = useToast();
  const [tonConnectUI] = useTonConnectUI();
  const [showBalance, setShowBalance] = useState(true);
  const [spaceBalance] = useState(15420.5);
  const [tonBalance, setTonBalance] = useState(0);
  const [transactions, setTransactions] = useState<TONTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  // Get translation function
  const t = (key: string) => getTranslation(key);

  useEffect(() => {
    checkWalletConnection();
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      console.log('TON Connect UI wallet status changed:', wallet);
      if (wallet) {
        setConnectedAddress(wallet.account.address);
        loadWalletData(wallet.account.address);
      } else {
        setConnectedAddress(null);
        setTonBalance(0);
        setTransactions([]);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [tonConnectUI]);

  const checkWalletConnection = () => {
    const wallet = tonConnectUI.wallet;
    console.log('Current TON Connect UI wallet:', wallet);
    if (wallet) {
      const address = wallet.account.address;
      setConnectedAddress(address);
      loadWalletData(address);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      console.log('Attempting to connect TON wallet via UI...');
      await tonConnectUI.openModal();
      toast({
        title: t('openConnectionWindow'),
        description: t('pleaseSelectWallet')
      });
    } catch (error) {
      console.error('Error opening TON Connect modal:', error);
      toast({
        title: t('connectionError'),
        description: t('failedToOpenWallet'),
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await tonConnectUI.disconnect();
      setConnectedAddress(null);
      setTonBalance(0);
      setTransactions([]);
      toast({
        title: t('disconnected'),
        description: t('tonWalletDisconnected')
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const loadWalletData = async (address: string) => {
    setIsLoading(true);
    try {
      console.log('Loading TON wallet data for address:', address);
      const balanceData = await tonService.getBalance(address);
      setTonBalance(parseFloat(balanceData.balance));
      const txData = await tonService.getTransactions(address, 6);
      setTransactions(txData);
      console.log('TON data loaded:', { balance: balanceData, transactions: txData });
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast({
        title: t('loadingDataError'),
        description: t('failedToLoadWallet'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isWalletConnected = !!tonConnectUI.wallet;

  // If no wallet connected, show connection screen
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-3 pb-24">
        <div className="max-w-md mx-auto space-y-4">
          {/* Compact Header */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-zinc-50 mb-1">
              {t('smartWallet')}
            </h1>
            <p className="text-gray-300 text-sm px-2">{t('walletDescription')}</p>
          </div>

          {/* Connection Card */}
          <Card className="bg-gradient-to-br from-purple-500/15 to-pink-500/15 backdrop-blur-xl border border-purple-500/40 rounded-2xl">
            <CardContent className="p-4 text-center">
              <div className="mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white mb-1">{t('connectWallet')}</h2>
                <p className="text-gray-300 text-sm">{t('connectWalletToAccess')}</p>
              </div>
              
              <Button 
                onClick={connectWallet} 
                disabled={isConnecting} 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 h-10 text-sm font-semibold rounded-xl w-full"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isConnecting ? t('connecting') : t('connectWallet')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-3 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Compact Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Wallet className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
            {t('smartWallet')}
          </h1>
          <p className="text-gray-300 text-sm px-2">{t('walletDescription')}</p>
        </div>

        {/* Wallet Connection Status */}
        <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border border-green-500/40 rounded-2xl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 font-medium text-sm">{t('walletConnected')}</span>
              </div>
              <Button 
                onClick={disconnectWallet} 
                variant="outline" 
                size="sm" 
                className="border-red-500/50 text-xs h-7 px-2 bg-violet-700 hover:bg-violet-600 text-slate-50"
              >
                <LogOut className="w-3 h-3 mr-1" />
                {t('disconnectWallet')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Compact Balance Cards */}
        <div className="space-y-3">
          {/* $SPACE Balance */}
          <Card className="bg-gradient-to-br from-blue-500/15 to-purple-500/15 backdrop-blur-xl border border-blue-500/40 rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <div>
                    <span className="block">$SPACE</span>
                    <span className="text-xs text-blue-300 font-normal">{t('mainCurrency')}</span>
                  </div>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowBalance(!showBalance)} 
                  className="text-blue-300 hover:text-white hover:bg-blue-500/20 h-7 w-7 p-0 rounded-lg"
                >
                  {showBalance ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <p className="font-bold text-white text-lg">
                {showBalance ? spaceBalance.toLocaleString() : '••••••'}
              </p>
            </CardContent>
          </Card>

          {/* TON Balance */}
          <Card className="bg-gradient-to-br from-purple-500/15 to-pink-500/15 backdrop-blur-xl border border-purple-500/40 rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <div>
                    <span className="block">TON</span>
                  </div>
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => loadWalletData(connectedAddress!)} 
                  disabled={isLoading} 
                  className="text-purple-300 hover:text-white hover:bg-purple-500/20 h-7 w-7 p-0 rounded-lg"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-3">
              <p className="font-bold text-white text-lg">
                {showBalance ? tonBalance.toFixed(4) : '••••'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <SendModal 
        isOpen={showSendModal} 
        onClose={() => setShowSendModal(false)} 
        balance={tonBalance} 
        currency="TON" 
      />
      
      <ReceiveModal 
        isOpen={showReceiveModal} 
        onClose={() => setShowReceiveModal(false)} 
        address={connectedAddress!} 
      />
    </div>
  );
};

export default WalletPage;
