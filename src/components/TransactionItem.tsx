import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { TONTransaction } from '../services/tonService';
import { tonService } from '../services/tonService';
interface TransactionItemProps {
  transaction: TONTransaction;
  onViewExplorer: (hash: string) => void;
}
const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onViewExplorer
}) => {
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
  const getTransactionColor = (type: string) => {
    return type === 'in' ? 'text-green-400' : 'text-red-400';
  };
  return <div className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer" onClick={() => onViewExplorer(transaction.hash)}>
      <div className="flex items-center gap-4">
        
        <div className="min-w-0 flex-1">
          <p className="text-white font-semibold text-base truncate">
            {getTransactionDescription(transaction)}
          </p>
          <p className="text-gray-300 text-sm">
            {tonService.formatTimeAgo(transaction.timestamp)}
          </p>
          <p className="text-gray-400 text-xs">
            {transaction.type === 'in' ? 'من' : 'إلى'}: {tonService.formatAddress(transaction.type === 'in' ? transaction.from : transaction.to)}
          </p>
        </div>
      </div>
      
      <div className="text-right ml-3 flex items-center gap-3">
        <div>
          <p className={`font-bold text-base ${getTransactionColor(transaction.type)}`}>
            {transaction.type === 'in' ? '+' : '-'}{transaction.value} TON
          </p>
          <p className="text-gray-400 text-sm">رسوم: {transaction.fee} TON</p>
          {!transaction.hash.startsWith('fallback_') && <p className="text-blue-400 text-xs">انقر للعرض</p>}
        </div>
        
        {!transaction.hash.startsWith('fallback_') && <Button variant="ghost" size="sm" onClick={e => {
        e.stopPropagation();
        onViewExplorer(transaction.hash);
      }} className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-4 h-4" />
          </Button>}
      </div>
    </div>;
};
export default TransactionItem;