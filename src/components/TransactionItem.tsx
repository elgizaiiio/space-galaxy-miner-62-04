
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
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
    if (tx.type === 'in') return '📥';
    if (tx.type === 'out') return '📤';
    return '💎';
  };
  
  const getTransactionDescription = (tx: TONTransaction) => {
    if (tx.comment) {
      // Check if comment contains known patterns
      if (tx.comment.includes('upgrade') || tx.comment.includes('ترقية')) return t('miningSpeedUpgrade');
      if (tx.comment.includes('referral') || tx.comment.includes('إحالة')) return t('referralReward');
      return tx.comment;
    }
    if (tx.type === 'in') return t('receiveTON');
    return t('sendTON');
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
    
    if (minutes < 1) return t('now');
    if (minutes < 60) return `${t('minutesAgo').replace('minutes', minutes.toString())}`;
    if (hours < 24) return `${t('hoursAgo').replace('hours', hours.toString())}`;
    if (days === 1) return t('yesterday');
    return `${t('daysAgo').replace('days', days.toString())}`;
  };

  return <div className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer" onClick={() => onViewExplorer(transaction.hash)}>
      <div className="flex items-center gap-4">
        <div className="text-2xl">{getTransactionIcon(transaction)}</div>
        <div className="min-w-0 flex-1">
          
          <p className="text-gray-300 text-sm font-normal">
            {formatTimeAgo(transaction.timestamp)}
          </p>
          <p className="text-gray-400 text-xs">
            {transaction.type === 'in' ? t('from') : t('to')}: {tonService.formatAddress(transaction.type === 'in' ? transaction.from : transaction.to)}
          </p>
        </div>
      </div>
      
      <div className="text-right ml-3 flex items-center gap-3">
        <div>
          <p className={`font-bold text-base ${getTransactionColor(transaction.type)}`}>
            {transaction.type === 'in' ? '+' : '-'}{transaction.value} TON
          </p>
          <p className="text-gray-400 text-sm">{t('fee')}: {transaction.fee} TON</p>
          {!transaction.hash.startsWith('fallback_') && <p className="text-blue-400 text-xs">{t('clickToView')}</p>}
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
