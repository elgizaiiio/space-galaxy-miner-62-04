import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Send, History, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { tonService, type TONTransaction } from '../services/tonService';
import { getTranslation } from '../utils/language';
import SendModal from './SendModal';
import TransactionHistoryModal from './TransactionHistoryModal';

const WalletPage = () => {
  const { toast } = useToast();
  const [tonConnectUI] = useTonConnectUI();
  const [spaceBalance] = useState(15420.5);
  const [tonBalance, setTonBalance] = useState(0);
  const [transactions, setTransactions] = useState<TONTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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

  // Calculate total balance in USD (using TON balance for now)
  const totalBalanceUSD = tonBalance * 5.2; // Assuming 1 TON = $5.2 (you can update this with real-time price)

  // If no wallet connected, show connection screen
  if (!isWalletConnected) {
    return (
      <div 
        className="min-h-screen text-white flex flex-col relative"
        style={{
          backgroundImage: `url('/lovable-uploads/d1b0fb13-b222-4fb2-a0d7-ca5cc2ed9d2d.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-center mb-2">
              {t('smartWallet')}
            </h1>
            <p className="text-gray-300 text-center text-sm">{t('connectWalletToAccess')}</p>
          </div>
          
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting} 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full text-sm font-semibold"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isConnecting ? t('connecting') : t('connectWallet')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen text-white flex flex-col relative"
      style={{
        backgroundImage: `url('/lovable-uploads/d1b0fb13-b222-4fb2-a0d7-ca5cc2ed9d2d.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Header with address and disconnect */}
      <div className="relative z-10 flex items-center justify-between p-3 border-b border-gray-800/50">
        <div className="flex items-center gap-2 bg-gray-800/70 rounded-full px-3 py-1">
          <img 
            src="/lovable-uploads/60d2a535-0c51-4428-b219-eca7f18bb598.png" 
            alt="TON" 
            className="w-5 h-5 rounded-full"
          />
          <span className="text-xs text-gray-300">
            {connectedAddress ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-3)}` : 'UQA...xxf'}
          </span>
        </div>
        <Button 
          onClick={disconnectWallet} 
          variant="ghost" 
          size="sm" 
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 w-7 p-0"
        >
          <LogOut className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* Balance display */}
        <div className="text-center mb-8">
          <div className="text-4xl font-light mb-1 text-gray-200">
            ${totalBalanceUSD.toFixed(2)}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-12 mb-10">
          <button 
            onClick={() => setShowSendModal(true)}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-gray-800/70 rounded-full flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-300 text-sm">Send</span>
          </button>

          <button 
            onClick={() => setShowHistoryModal(true)}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-gray-800/70 rounded-full flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-300 text-sm">History</span>
          </button>
        </div>

        {/* Currency list */}
        <div className="w-full max-w-xs space-y-3">
          {/* Toncoin */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-800/30 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/60d2a535-0c51-4428-b219-eca7f18bb598.png" 
                alt="TON" 
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="text-white font-medium text-sm">Toncoin</div>
                <div className="text-gray-400 text-xs">{tonBalance.toFixed(1)} TON</div>
              </div>
            </div>
            <div className="text-white font-medium text-sm">${(tonBalance * 5.2).toFixed(2)}</div>
          </div>

          {/* SPACE */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-800/30 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/859d4b2d-567d-4e4f-ba7c-d739fa472910.png" 
                alt="SPACE" 
                className="w-8 h-8 rounded-full"
              />
              <div>
                <div className="text-white font-medium text-sm">SPACE</div>
                <div className="text-gray-400 text-xs">{spaceBalance.toLocaleString()} $SPACE</div>
              </div>
            </div>
            <div className="text-white font-medium text-sm">$0</div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SendModal 
        isOpen={showSendModal} 
        onClose={() => setShowSendModal(false)} 
        balance={tonBalance} 
        currency="TON" 
      />
      
      <TransactionHistoryModal 
        isOpen={showHistoryModal} 
        onClose={() => setShowHistoryModal(false)} 
        transactions={transactions}
        address={connectedAddress!}
      />
    </div>
  );
};

export default WalletPage;
