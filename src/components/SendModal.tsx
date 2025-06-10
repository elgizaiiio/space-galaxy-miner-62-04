
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, X, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTranslation } from '@/utils/language';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  currency: string;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, balance, currency }) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const t = (key: string) => getTranslation(key);

  const handleSend = async () => {
    if (!amount || !address) {
      toast({
        title: t('error'),
        description: t('fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(amount) > balance) {
      toast({
        title: t('insufficientBalance'),
        description: t('amountExceedsBalance'),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate transaction
    setTimeout(() => {
      toast({
        title: t('sentSuccessfully'),
        description: `${t('sentToAddress')} ${amount} ${currency} ${t('sentToAddress')} ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
      setIsLoading(false);
      setAmount('');
      setAddress('');
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900/98 via-indigo-900/95 to-purple-900/98 backdrop-blur-xl border-2 border-indigo-500/30 text-white max-w-sm rounded-3xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl">
                <Send className="w-5 h-5 text-blue-400" />
              </div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('sendCurrency')} {currency}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 pt-2">
          {/* Balance Display */}
          <div className="text-center p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-400" />
              <p className="text-sm text-gray-300">{t('availableBalance')}</p>
            </div>
            <p className="text-2xl font-bold text-white">{balance.toFixed(4)} {currency}</p>
            <p className="text-xs text-gray-400 mt-1">${(balance * 5.2).toFixed(2)} USD</p>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-white mb-2 block text-sm font-medium flex items-center gap-2">
                <span>المبلغ</span>
                <span className="text-xs text-gray-400">({currency})</span>
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 h-12 text-lg rounded-xl pr-16"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  {currency}
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-white mb-2 block text-sm font-medium">
                عنوان المستلم
              </Label>
              <Input
                id="address"
                placeholder="UQA..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 h-12 rounded-xl"
              />
              <p className="text-xs text-gray-400 mt-1">تأكد من صحة العنوان قبل الإرسال</p>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={isLoading || !amount || !address}
            className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 h-12 text-base font-semibold rounded-xl shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري الإرسال...
              </div>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                إرسال {currency}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendModal;
