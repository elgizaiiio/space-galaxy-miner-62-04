
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Send, ArrowDownToLine, ArrowUpFromLine, Eye, EyeOff, Copy, ExternalLink, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WalletPage = () => {
  const { toast } = useToast();
  const [showBalance, setShowBalance] = useState(true);
  const [spaceBalance] = useState(15420.5);
  const [tonBalance] = useState(2.45);
  
  const walletAddress = "UQAqPFXgVhDpXe-WbJgfwVd_ETkmPMqEjLaNKLtDTKxVAJgk";

  const transactions = [
    {
      id: '1',
      type: 'mining',
      amount: '+250 $SPACE',
      description: 'مكافأة التعدين',
      time: 'منذ 5 دقائق',
      status: 'completed'
    },
    {
      id: '2',
      type: 'upgrade',
      amount: '-0.5 TON',
      description: 'ترقية سرعة التعدين x5',
      time: 'منذ ساعة',
      status: 'completed'
    },
    {
      id: '3',
      type: 'task',
      amount: '+500 $SPACE',
      description: 'مكافأة مهمة يومية',
      time: 'منذ 3 ساعات',
      status: 'completed'
    },
    {
      id: '4',
      type: 'referral',
      amount: '+1000 $SPACE',
      description: 'مكافأة دعوة صديق',
      time: 'أمس',
      status: 'completed'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ عنوان المحفظة إلى الحافظة",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'mining': return '⛏️';
      case 'upgrade': return '🚀';
      case 'task': return '✅';
      case 'referral': return '👥';
      default: return '💎';
    }
  };

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
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <div className="p-2 bg-purple-500/30 rounded-xl">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <span className="block">TON</span>
                  <span className="text-sm text-purple-300 font-normal">عملة الشبكة</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 relative">
              <p className="text-3xl font-bold text-white mb-2">
                {showBalance ? tonBalance.toFixed(2) : '••••'}
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
          <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-16 text-base font-semibold rounded-2xl shadow-xl border-0 hover:scale-105 transition-all duration-300">
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
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3 p-4 bg-black/30 rounded-2xl border border-white/10">
              <code className="text-xs text-gray-200 flex-1 break-all leading-relaxed font-mono">
                {walletAddress}
              </code>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(walletAddress)}
                  className="text-gray-400 hover:text-white hover:bg-gray-500/20 h-10 w-10 p-0 rounded-xl"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
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
            <CardTitle className="text-white text-xl flex items-center gap-3">
              <div className="p-2 bg-indigo-500/30 rounded-xl">
                <span className="text-lg">📊</span>
              </div>
              سجل المعاملات
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="text-2xl p-2 bg-white/10 rounded-xl">{getTransactionIcon(tx.type)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-semibold text-base truncate">{tx.description}</p>
                    <p className="text-gray-300 text-sm">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <p className={`font-bold text-base ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount}
                  </p>
                  <p className="text-gray-400 text-sm">{tx.status === 'completed' ? 'مكتملة' : 'قيد المعالجة'}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;
