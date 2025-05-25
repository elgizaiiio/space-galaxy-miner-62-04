
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, Send, ArrowDownToLine, ArrowUpFromLine, Eye, EyeOff, Copy, ExternalLink } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-blue-900 to-purple-900 p-3 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent mb-2">
            المحفظة
          </h1>
          <p className="text-gray-300 text-sm">إدارة أرصدتك ومعاملاتك</p>
        </div>

        {/* Balance Cards */}
        <div className="space-y-4">
          {/* $SPACE Balance */}
          <Card className="glass-card neon-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <span className="text-xl">💎</span>
                  $SPACE
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                >
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold text-white mb-1">
                {showBalance ? spaceBalance.toLocaleString() : '••••••'}
              </p>
              <p className="text-gray-400 text-xs">≈ ${(spaceBalance * 0.001).toFixed(2)} USD</p>
            </CardContent>
          </Card>

          {/* TON Balance */}
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <span className="text-xl">💎</span>
                TON
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-2xl font-bold text-white mb-1">
                {showBalance ? tonBalance.toFixed(2) : '••••'}
              </p>
              <p className="text-gray-400 text-xs">≈ ${(tonBalance * 2.1).toFixed(2)} USD</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <Button className="space-button h-14 text-sm">
            <ArrowUpFromLine className="w-4 h-4 mr-2" />
            إرسال
          </Button>
          <Button variant="outline" className="h-14 border-white/20 text-white hover:bg-white/10 text-sm">
            <ArrowDownToLine className="w-4 h-4 mr-2" />
            استقبال
          </Button>
        </div>

        {/* Wallet Address */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2 text-base">
              <Wallet className="w-4 h-4" />
              عنوان المحفظة
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
              <code className="text-xs text-gray-300 flex-1 break-all leading-relaxed">
                {walletAddress}
              </code>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(walletAddress)}
                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base">سجل المعاملات</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-lg">{getTransactionIcon(tx.type)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm truncate">{tx.description}</p>
                    <p className="text-gray-400 text-xs">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className={`font-bold text-sm ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.amount}
                  </p>
                  <p className="text-gray-400 text-xs">{tx.status === 'completed' ? 'مكتملة' : 'قيد المعالجة'}</p>
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
