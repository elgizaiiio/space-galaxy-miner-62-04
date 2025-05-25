import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Send, ArrowDownToLine, ArrowUpFromLine, Eye, EyeOff, Copy, ExternalLink, TrendingUp, RefreshCw, LogIn, LogOut, Settings, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { tonService, type TONTransaction } from '../services/tonService';
import SendModal from './SendModal';
import ReceiveModal from './ReceiveModal';
import TransactionItem from './TransactionItem';
const WalletPage = () => {
  const {
    toast
  } = useToast();
  const [tonConnectUI] = useTonConnectUI();
  const [showBalance, setShowBalance] = useState(true);
  const [spaceBalance] = useState(15420.5);
  const [tonBalance, setTonBalance] = useState(2.45);
  const [transactions, setTransactions] = useState<TONTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const fallbackAddress = "UQAqPFXgVhDpXe-WbJgfwVd_ETkmPMqEjLaNKLtDTKxVAJgk";
  useEffect(() => {
    checkWalletConnection();
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      console.log('TON Connect UI wallet status changed:', wallet);
      if (wallet) {
        setConnectedAddress(wallet.account.address);
        loadWalletData(wallet.account.address);
      } else {
        setConnectedAddress(null);
        setTransactions([]);
        setTonBalance(0);
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
    } else {
      setConnectedAddress(fallbackAddress);
      loadWalletData(fallbackAddress);
    }
  };
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      console.log('Attempting to connect TON wallet via UI...');
      await tonConnectUI.openModal();
      toast({
        title: "فتح نافذة الاتصال",
        description: "يرجى اختيار محفظة TON للاتصال"
      });
    } catch (error) {
      console.error('Error opening TON Connect modal:', error);
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في فتح نافذة الاتصال بالمحفظة",
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
      setTransactions([]);
      setTonBalance(0);
      toast({
        title: "تم قطع الاتصال",
        description: "تم قطع الاتصال بمحفظة TON"
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
        title: "خطأ في تحميل البيانات",
        description: "فشل في تحميل بيانات المحفظة من شبكة TON",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ عنوان المحفظة إلى الحافظة"
    });
  };
  const openTxExplorer = (hash: string) => {
    if (hash.startsWith('fallback_')) return;
    window.open(`https://tonscan.org/tx/${hash}`, '_blank');
  };
  const currentAddress = connectedAddress || fallbackAddress;
  const isWalletConnected = !!tonConnectUI.wallet;
  return <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl animate-pulse-glow">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              المحفظة الذكية
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">إدارة أرصدتك ومعاملاتك بأمان وسهولة</p>
          </div>
        </div>

        {/* Quick Actions */}
        

        {/* Wallet Connection Status */}
        <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border-2 border-green-500/40 rounded-3xl overflow-hidden">
          <CardContent className="p-6 py-[10px] px-[76px] bg-pink-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                
                
              </div>
              <div className="flex gap-2">
                {isWalletConnected ? <Button onClick={disconnectWallet} variant="outline" size="sm" className="bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30">
                    <LogOut className="w-4 h-4 mr-2" />
                    قطع الاتصال
                  </Button> : <Button onClick={connectWallet} disabled={isConnecting} variant="outline" size="sm" className="border-green-500/50 text-green-200 my-0 mx-[24px] bg-pink-600 hover:bg-pink-500">
                    <LogIn className="w-4 h-4 mr-2" />
                    {isConnecting ? 'جاري الاتصال...' : 'ربط المحفظة'}
                  </Button>}
              </div>
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
                    <span className="text-sm text-blue-300 font-normal">العملة الرئيسية</span>
                  </div>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)} className="text-blue-300 hover:text-white hover:bg-blue-500/20 h-10 w-10 p-0 rounded-xl">
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative my-0">
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
                <Button variant="ghost" size="sm" onClick={() => loadWalletData(currentAddress)} disabled={isLoading} className="text-purple-300 hover:text-white hover:bg-purple-500/20 h-10 w-10 p-0 rounded-xl">
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative rounded-full">
              <p className="font-bold text-white mb-3 text-2xl">
                {showBalance ? tonBalance.toFixed(4) : '••••'}
              </p>
              <div className="flex items-center justify-between">
                
                
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Action Buttons */}
        

        {/* Enhanced Wallet Address */}
        

        {/* Enhanced Transaction History */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl flex items-center gap-3">
                
                آخر المعاملات
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => loadWalletData(currentAddress)} disabled={isLoading} className="text-indigo-300 hover:text-white hover:bg-indigo-500/20 h-10 w-10 p-0 rounded-xl">
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {isLoading ? <div className="text-center text-gray-400 py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>جاري تحميل المعاملات...</p>
              </div> : transactions.length === 0 ? <div className="text-center text-gray-400 py-8">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8" />
                </div>
                <p className="text-lg font-semibold mb-2">لا توجد معاملات</p>
                <p className="text-sm">ابدأ بإرسال أو استقبال العملات</p>
              </div> : transactions.map(tx => <TransactionItem key={tx.hash} transaction={tx} onViewExplorer={openTxExplorer} />)}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <SendModal isOpen={showSendModal} onClose={() => setShowSendModal(false)} balance={tonBalance} currency="TON" />
      
      <ReceiveModal isOpen={showReceiveModal} onClose={() => setShowReceiveModal(false)} address={currentAddress} />
    </div>;
};
export default WalletPage;