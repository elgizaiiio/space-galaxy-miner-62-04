import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Send, ArrowDownToLine, ArrowUpFromLine, Eye, EyeOff, Copy, ExternalLink, TrendingUp, RefreshCw, LogIn, LogOut, Settings, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { tonService, type TONTransaction } from '../services/tonService';
import { getStoredLanguage, getTranslation } from '../utils/language';
import SendModal from './SendModal';
import ReceiveModal from './ReceiveModal';
import TransactionItem from './TransactionItem';
import LanguageSwitcher from './LanguageSwitcher';
const WalletPage = () => {
  const {
    toast
  } = useToast();
  const [tonConnectUI] = useTonConnectUI();
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [showBalance, setShowBalance] = useState(true);
  const [spaceBalance] = useState(15420.5);
  const [tonBalance, setTonBalance] = useState(0);
  const [transactions, setTransactions] = useState<TONTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  // Get translation function for current language
  const t = (key: string) => getTranslation(key, currentLanguage.code);
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
      console.log('TON data loaded:', {
        balance: balanceData,
        transactions: txData
      });
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
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('copied'),
      description: t('walletAddressCopied')
    });
  };
  const openTxExplorer = (hash: string) => {
    if (hash.startsWith('fallback_')) return;
    window.open(`https://tonscan.org/tx/${hash}`, '_blank');
  };
  const isWalletConnected = !!tonConnectUI.wallet;

  // If no wallet connected, show connection screen
  if (!isWalletConnected) {
    return <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
            <div className="relative">
              {/* Language Switcher */}
              <div className="absolute top-0 right-0">
                <LanguageSwitcher onLanguageChange={() => setCurrentLanguage(getStoredLanguage())} />
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl animate-pulse-glow">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                {t('smartWallet')}
              </h1>
              <p className="text-gray-300 text-base leading-relaxed">{t('walletDescription')}</p>
            </div>
          </div>

          {/* Connection Card */}
          <Card className="bg-gradient-to-br from-purple-500/15 to-pink-500/15 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('connectWallet')}</h2>
                <p className="text-gray-300">{t('connectWalletToAccess')}</p>
              </div>
              
              <Button onClick={connectWallet} disabled={isConnecting} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 h-14 text-base font-semibold rounded-2xl w-full">
                <LogIn className="w-5 h-5 mr-2" />
                {isConnecting ? t('connecting') : t('connectWallet')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative">
            {/* Language Switcher */}
            <div className="absolute top-0 right-0">
              <LanguageSwitcher onLanguageChange={() => setCurrentLanguage(getStoredLanguage())} />
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl animate-pulse-glow">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              {t('smartWallet')}
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">{t('walletDescription')}</p>
          </div>
        </div>

        {/* Wallet Connection Status */}
        <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border-2 border-green-500/40 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 font-medium">{t('walletConnected')}</span>
              </div>
              <Button onClick={disconnectWallet} variant="outline" size="sm" className="bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30 text-base">
                <LogOut className="w-4 h-4 mr-2" />
                {t('disconnectWallet')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Balance Cards */}
        <div className="space-y-4">
          {/* $SPACE Balance */}
          <Card className="bg-gradient-to-br from-blue-500/15 to-purple-500/15 backdrop-blur-xl border-2 border-blue-500/40 rounded-3xl overflow-hidden relative group hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
            <CardHeader className="pb-3 relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <div>
                    <span className="block">$SPACE</span>
                    <span className="text-sm text-blue-300 font-normal">{t('mainCurrency')}</span>
                  </div>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)} className="text-blue-300 hover:text-white hover:bg-blue-500/20 h-10 w-10 p-0 rounded-xl">
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative">
              <p className="font-bold text-white mb-3 text-2xl">
                {showBalance ? spaceBalance.toLocaleString() : '••••••'}
              </p>
            </CardContent>
          </Card>

          {/* TON Balance */}
          <Card className="bg-gradient-to-br from-purple-500/15 to-pink-500/15 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl overflow-hidden relative group hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
            <CardHeader className="pb-3 relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <div>
                    <span className="block">TON</span>
                  </div>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => loadWalletData(connectedAddress!)} disabled={isLoading} className="text-purple-300 hover:text-white hover:bg-purple-500/20 h-10 w-10 p-0 rounded-xl">
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative">
              <p className="font-bold text-white mb-3 text-2xl">
                {showBalance ? tonBalance.toFixed(4) : '••••'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        

        {/* Wallet Address Display */}
        

        {/* Enhanced Transaction History */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl flex items-center gap-3">
                {t('latestTransactions')}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => loadWalletData(connectedAddress!)} disabled={isLoading} className="text-indigo-300 hover:text-white hover:bg-indigo-500/20 h-10 w-10 p-0 rounded-xl">
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {isLoading ? <div className="text-center text-gray-400 py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>{t('loadingTransactions')}</p>
              </div> : transactions.length === 0 ? <div className="text-center text-gray-400 py-8">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8" />
                </div>
                <p className="text-lg font-semibold mb-2">{t('noTransactions')}</p>
                <p className="text-sm">{t('startSendingReceiving')}</p>
              </div> : transactions.map(tx => <TransactionItem key={tx.hash} transaction={tx} onViewExplorer={openTxExplorer} language={currentLanguage.code} />)}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <SendModal isOpen={showSendModal} onClose={() => setShowSendModal(false)} balance={tonBalance} currency="TON" />
      
      <ReceiveModal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} address={connectedAddress!} />
    </div>;
};
export default WalletPage;