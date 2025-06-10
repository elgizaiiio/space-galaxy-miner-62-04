
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, History, Clock } from 'lucide-react';
import { TONTransaction } from '../services/tonService';
import TransactionItem from './TransactionItem';
import { getTranslation } from '@/utils/language';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: TONTransaction[];
  address: string | null;
}

const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  transactions,
  address 
}) => {
  const t = (key: string) => getTranslation(key);

  const handleViewExplorer = (hash: string) => {
    if (!hash.startsWith('fallback_')) {
      window.open(`https://tonscan.org/tx/${hash}`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900/98 via-gray-900/95 to-black/98 backdrop-blur-xl border-2 border-gray-700/50 text-white max-w-sm max-h-[75vh] overflow-hidden rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-green-500/20 to-teal-600/20 rounded-xl">
                <History className="w-4 h-4 text-green-400" />
              </div>
              <DialogTitle className="text-lg font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                سجل المعاملات
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10 h-6 w-6 p-0 rounded-full"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          {/* Wallet Address Display */}
          {address && (
            <div className="bg-white/5 rounded-xl p-2 border border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span>العنوان:</span>
                <span className="font-mono text-blue-400">{address.slice(0, 6)}...{address.slice(-4)}</span>
              </div>
            </div>
          )}
        </DialogHeader>
        
        <div className="space-y-2 pt-1 overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {transactions.length > 0 ? (
            <>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <Clock className="w-3 h-3" />
                <span>آخر {transactions.length} معاملات</span>
              </div>
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.hash}
                  transaction={transaction}
                  onViewExplorer={handleViewExplorer}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <History className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-gray-400 text-base mb-2">لا توجد معاملات</p>
              <p className="text-gray-500 text-xs">ستظهر معاملاتك هنا عند إجرائها</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionHistoryModal;
