
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

  // If no wallet connected, show connection screen
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-2">
              {t('smartWallet')}
            </h1>
            <p className="text-gray-400 text-center">{t('connectWalletToAccess')}</p>
          </div>
          
          <Button 
            onClick={connectWallet} 
            disabled={isConnecting} 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full text-lg font-semibold"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {isConnecting ? t('connecting') : t('connectWallet')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header with address and disconnect */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">T</span>
          </div>
          <span className="text-sm text-gray-300">
            {connectedAddress ? `${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-3)}` : 'UQA...xxf'}
          </span>
        </div>
        <Button 
          onClick={disconnectWallet} 
          variant="ghost" 
          size="sm" 
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Balance display */}
        <div className="text-center mb-12">
          <div className="text-6xl font-light mb-2 text-gray-300">
            $&lt;0.01
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-16 mb-16">
          <button 
            onClick={() => setShowSendModal(true)}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-400 text-lg">Send</span>
          </button>

          <button 
            onClick={() => setShowHistoryModal(true)}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-400 text-lg">History</span>
          </button>
        </div>

        {/* Currency list */}
        <div className="w-full max-w-sm space-y-4">
          {/* Toncoin */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <div className="text-white font-semibold">Toncoin</div>
                <div className="text-gray-400 text-sm">{tonBalance.toFixed(1)} TON</div>
              </div>
            </div>
            <div className="text-white font-semibold">$0</div>
          </div>

          {/* SPACE */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-800 rounded-full"></div>
              </div>
              <div>
                <div className="text-white font-semibold">SPACE</div>
                <div className="text-gray-400 text-sm">{spaceBalance.toLocaleString()} $SPACE</div>
              </div>
            </div>
            <div className="text-white font-semibold">$0</div>
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
