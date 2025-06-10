
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { TONTransaction } from '../services/tonService';
import TransactionItem from './TransactionItem';
import { getTranslation } from '@/utils/language';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: TONTransaction[];
  address: string;
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
      <DialogContent className="bg-black border border-gray-800 text-white max-w-sm max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-white">
              {t('transactionHistory')}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-gray-800 h-7 w-7 p-0 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 pt-2 overflow-y-auto max-h-96">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TransactionItem
                key={transaction.hash}
                transaction={transaction}
                onViewExplorer={handleViewExplorer}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">{t('noTransactionsFound')}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionHistoryModal;
