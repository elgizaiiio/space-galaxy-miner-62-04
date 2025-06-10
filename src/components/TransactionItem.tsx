
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { TONTransaction } from '../services/tonService';
import { tonService } from '../services/tonService';
import { getTranslation } from '../utils/language';

interface TransactionItemProps {
  transaction: TONTransaction;
  onViewExplorer: (hash: string) => void;
  language?: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onViewExplorer,
  language = 'en'
}) => {
  const t = (key: string) => getTranslation(key);
  
  const getTransactionIcon = (tx: TONTransaction) => {
    if (tx.type === 'in') {
      return <ArrowDownLeft className="w-5 h-5 text-green-400" />;
    }
    return <ArrowUpRight className="w-5 h-5 text-red-400" />;
  };
  
  const getTransactionDescription = (tx: TONTransaction) => {
    if (tx.comment) {
      if (tx.comment.includes('upgrade') || tx.comment.includes('ترقية')) return 'ترقية سرعة التعدين';
      if (tx.comment.includes('referral') || tx.comment.includes('إحالة')) return 'مكافأة الإحالة';
      return tx.comment;
    }
    if (tx.type === 'in') return 'استلام TON';
    return 'إرسال TON';
  };
  
  const getTransactionColor = (type: string) => {
    return type === 'in' ? 'text-green-400' : 'text-red-400';
  };
  
  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days === 1) return 'أمس';
    return `منذ ${days} أيام`;
  };

  return (
    <div 
      className="group flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl border border-white/10 hover:from-white/10 hover:to-white/15 transition-all duration-300 cursor-pointer" 
      onClick={() => onViewExplorer(transaction.hash)}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Transaction Icon */}
        <div className={`p-3 rounded-xl ${transaction.type === 'in' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {getTransactionIcon(transaction)}
        </div>
        
        {/* Transaction Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white text-sm font-semibold">
              {getTransactionDescription(transaction)}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(transaction.timestamp)}</span>
            </div>
          </div>
          
          <p className="text-gray-400 text-xs">
            {transaction.type === 'in' ? 'من' : 'إلى'}: {tonService.formatAddress(transaction.type === 'in' ? transaction.from : transaction.to)}
          </p>
        </div>
      </div>
      
      {/* Amount and Actions */}
      <div className="text-right ml-3 flex items-center gap-3">
        <div>
          <p className={`font-bold text-base ${getTransactionColor(transaction.type)}`}>
            {transaction.type === 'in' ? '+' : '-'}{transaction.value} TON
          </p>
          <p className="text-gray-400 text-xs">رسوم: {transaction.fee} TON</p>
          {!transaction.hash.startsWith('fallback_') && (
            <p className="text-blue-400 text-xs mt-1">اضغط للعرض</p>
          )}
        </div>
        
        {!transaction.hash.startsWith('fallback_') && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onViewExplorer(transaction.hash);
            }} 
            className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
