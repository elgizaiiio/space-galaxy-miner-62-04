import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Send, ArrowDownToLine, ArrowUpFromLine, Eye, EyeOff, Copy, ExternalLink, TrendingUp, RefreshCw, LogIn, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { tonService, type TONTransaction } from '../services/tonService';

const WalletPage = () => {
  const { toast } = useToast();
  const [tonConnectUI] = useTonConnectUI();
  const [showBalance, setShowBalance] = useState(true);
  const [spaceBalance] = useState(15420.5);
  const [tonBalance, setTonBalance] = useState(2.45);
  const [transactions, setTransactions] = useState<TONTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  
  const fallbackAddress = "UQAqPFXgVhDpXe-WbJgfwVd_ETkmPMqEjLaNKLtDTKxVAJgk";

  useEffect(() => {
    checkWalletConnection();
    
    // Listen for TON Connect UI wallet changes
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
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
      // Use fallback address for demo
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
        description: "يرجى اختيار محفظة TON للاتصال",
      });
    } catch (error) {
      console.error('Error opening TON Connect modal:', error);
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في فتح نافذة الاتصال بالمحفظة",
        variant: "destructive",
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
        description: "تم قطع الاتصال بمحفظة TON",
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const loadWalletData = async (address: string) => {
    setIsLoading(true);
    try {
      console.log('Loading TON wallet data for address:', address);
      
      // Load balance
      const balanceData = await tonService.getBalance(address);
      setTonBalance(parseFloat(balanceData.balance));
      
      // Load transactions
      const txData = await tonService.getTransactions(address, 6);
      setTransactions(txData);
      
      console.log('TON data loaded:', { balance: balanceData, transactions: txData });
    } catch (error) {
      console.error('Error loading wallet data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "فشل في تحميل بيانات المحفظة من شبكة TON",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ عنوان المحفظة إلى الحافظة",
    });
  };

  const getTransactionIcon = (tx: TONTransaction) => {
    if (tx.type === 'in') return '📥';
    if (tx.type === 'out') return '📤';
    return '💎';
  };

  const getTransactionDescription = (tx: TONTransaction) => {
    if (tx.comment) return tx.comment;
    if (tx.type === 'in') return 'استقبال TON';
    return 'إرسال TON';
  };

  const openTxExplorer = (hash: string) => {
    if (hash.startsWith('fallback_')) return;
    window.open(`https://tonscan.org/tx/${hash}`, '_blank');
  };

  const currentAddress = connectedAddress || fallbackAddress;
  const isWalletConnected = !!tonConnectUI.wallet;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              المحفظة
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">إدارة أرصدتك ومعاملاتك بسهولة</p>
          </div>
        </div>

        {/* Wallet Connection Status */}
        <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border-2 border-green-500/40 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isWalletConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <span className="text-white font-semibold">
                  {isWalletConnected ? 'محفظة متصلة' : 'وضع العرض التجريبي'}
                </span>
              </div>
              <div className="flex gap-2">
                {isWalletConnected ? (
                  <Button
                    onClick={disconnectWallet}
                    variant="outline"
                    size="sm"
                    className="bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    قطع الاتصال
                  </Button>
                ) : (
                  <Button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    variant="outline"
                    size="sm"
                    className="bg-green-500/20 border-green-500/50 text-green-200 hover:bg-green-500/30"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {isConnecting ? 'جاري الاتصال...' : 'ربط المحفظة'}
                  </Button>
                )}
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
                  <div className="p-2 bg-blue-500/30 rounded-xl">
                    <span className="text-2xl">💎</span>
                  </div>
                  <div>
                    <span className="block">$SPACE</span>
                    <span className="text-sm text-blue-300 font-normal">العملة الرئيسية</span>
                  </div>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-blue-300 hover:text-white hover:bg-blue-500/20 h-10 w-10 p-0 rounded-xl"
                >
                  {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative">
              <p className="text-3xl font-bold text-white mb-2">
                {showBalance ? spaceBalance.toLocaleString() : '••••••'}
              </p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-blue-300 text-sm">≈ ${(spaceBalance * 0.001).toFixed(2)} USD</p>
              </div>
            </CardContent>
          </Card>

          {/* TON Balance */}
          <Card className="bg-gradient-to-br from-purple-500/15 to-pink-500/15 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl overflow-hidden relative group hover:scale-[1.02] transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
            <CardHeader className="pb-3 relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <div className="p-2 bg-purple-500/30 rounded-xl">
                    <span className="text-2xl">💎</span>
                  </div>
                  <div>
                    <span className="block">TON</span>
                    <span className="text-sm text-purple-300 font-normal">عملة الشبكة</span>
                  </div>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => loadWalletData(currentAddress)}
                  disabled={isLoading}
                  className="text-purple-300 hover:text-white hover:bg-purple-500/20 h-10 w-10 p-0 rounded-xl"
                >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative">
              <p className="text-3xl font-bold text-white mb-2">
                {showBalance ? tonBalance.toFixed(4) : '••••'}
              </p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-purple-300 text-sm">≈ ${(tonBalance * 2.1).toFixed(2)} USD</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-2 gap-4 my-8">
          <Button 
            disabled={!isWalletConnected}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-16 text-base font-semibold rounded-2xl shadow-xl border-0 hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            <ArrowUpFromLine className="w-5 h-5 mr-2" />
            إرسال
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 h-16 text-base font-semibold rounded-2xl shadow-xl border-0 hover:scale-105 transition-all duration-300">
            <ArrowDownToLine className="w-5 h-5 mr-2" />
            استقبال
          </Button>
        </div>

        {/* Enhanced Wallet Address */}
        <Card className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur-xl border border-gray-500/30 rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-3 text-lg">
              <div className="p-2 bg-gray-500/30 rounded-xl">
                <Wallet className="w-5 h-5" />
              </div>
              عنوان المحفظة
              {!isWalletConnected && (
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                  تجريبي
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3 p-4 bg-black/30 rounded-2xl border border-white/10">
              <code className="text-xs text-gray-200 flex-1 break-all leading-relaxed font-mono">
                {currentAddress}
              </code>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(currentAddress)}
                  className="text-gray-400 hover:text-white hover:bg-gray-500/20 h-10 w-10 p-0 rounded-xl"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://tonscan.org/address/${currentAddress}`, '_blank')}
                  className="text-gray-400 hover:text-white hover:bg-gray-500/20 h-10 w-10 p-0 rounded-xl"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Transaction History */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-xl flex items-center gap-3">
                <div className="p-2 bg-indigo-500/30 rounded-xl">
                  <span className="text-lg">📊</span>
                </div>
                سجل المعاملات
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => loadWalletData(currentAddress)}
                disabled={isLoading}
                className="text-indigo-300 hover:text-white hover:bg-indigo-500/20 h-10 w-10 p-0 rounded-xl"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {isLoading ? (
              <div className="text-center text-gray-400 py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>جاري تحميل المعاملات...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>لا توجد معاملات</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div 
                  key={tx.hash} 
                  className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  onClick={() => openTxExplorer(tx.hash)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl p-2 bg-white/10 rounded-xl">{getTransactionIcon(tx)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-semibold text-base truncate">{getTransactionDescription(tx)}</p>
                      <p className="text-gray-300 text-sm">
                        {tonService.formatTimeAgo(tx.timestamp)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {tx.type === 'in' ? 'من' : 'إلى'}: {tonService.formatAddress(tx.type === 'in' ? tx.from : tx.to)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className={`font-bold text-base ${tx.type === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === 'in' ? '+' : '-'}{tx.value} TON
                    </p>
                    <p className="text-gray-400 text-sm">رسوم: {tx.fee} TON</p>
                    {!tx.hash.startsWith('fallback_') && (
                      <p className="text-blue-400 text-xs">انقر للعرض</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;
