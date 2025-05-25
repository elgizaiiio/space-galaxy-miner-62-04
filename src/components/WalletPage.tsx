
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
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent mb-2">
            المحفظة
          </h1>
          <p className="text-gray-300">إدارة أرصدتك ومعاملاتك</p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* $SPACE Balance */}
          <Card className="glass-card neon-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <span className="text-2xl">💎</span>
                  $SPACE
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-400 hover:text-white"
                >
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white mb-2">
                {showBalance ? spaceBalance.toLocaleString() : '••••••'}
              </p>
              <p className="text-gray-400 text-sm">≈ ${(spaceBalance * 0.001).toFixed(2)} USD</p>
            </CardContent>
          </Card>

          {/* TON Balance */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <span className="text-2xl">💎</span>
                TON
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white mb-2">
                {showBalance ? tonBalance.toFixed(2) : '••••'}
              </p>
              <p className="text-gray-400 text-sm">≈ ${(tonBalance * 2.1).toFixed(2)} USD</p>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Address */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              عنوان المحفظة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
              <code className="text-sm text-gray-300 flex-1 break-all">
                {walletAddress}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(walletAddress)}
                className="text-gray-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button className="space-button h-16">
            <ArrowUpFromLine className="w-5 h-5 mr-2" />
            إرسال
          </Button>
          <Button variant="outline" className="h-16 border-white/20 text-white hover:bg-white/10">
            <ArrowDownToLine className="w-5 h-5 mr-2" />
            استقبال
          </Button>
        </div>

        {/* Transaction History */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">سجل المعاملات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getTransactionIcon(tx.type)}</div>
                  <div>
                    <p className="text-white font-medium">{tx.description}</p>
                    <p className="text-gray-400 text-sm">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
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
