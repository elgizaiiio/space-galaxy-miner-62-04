
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Gift, MessageSquare, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { getTranslation } from '../utils/language';

const ReferralPage = () => {
  const [referredUsers] = useState(12);
  const [totalEarned] = useState(2400);

  const t = (key: string) => getTranslation(key);
  
  const openTelegramBot = () => {
    window.open('https://t.me/Spacelbot', '_blank');
  };
  
  const referralStats = [{
    icon: Users,
    label: t('totalReferrals'),
    value: referredUsers,
    color: 'blue'
  }, {
    icon: Gift,
    label: t('totalEarned'),
    value: `${totalEarned} $SPACE`,
    color: 'green'
  }, {
    icon: Star,
    label: t('airdropBonus'),
    value: '50%',
    color: 'purple'
  }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-2 pb-20">
      <div className="max-w-md mx-auto space-y-3">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center mb-1">
              <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-xl animate-pulse-glow">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
              {t('friends')}
            </h1>
            <p className="text-gray-300 text-xs leading-relaxed">
              {t('inviteFriendsEarn')}
            </p>
          </div>
        </div>

        {/* Get Referral Link Instructions */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-indigo-500/30 rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-lg text-center flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t('getReferralLink')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                <p className="text-zinc-50 text-sm">{t('goToBot')} @Spacelbot {t('onTelegram')}</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                <p className="text-zinc-50 text-sm">{t('sendCommand')}: <code className="bg-white/10 px-1.5 py-0.5 rounded text-white text-xs">/space</code></p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                <p className="text-zinc-50 text-sm">{t('receiveLink')}</p>
              </div>
            </div>
            
            <Button onClick={openTelegramBot} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl flex items-center justify-center gap-2 h-10">
              <MessageSquare className="w-3.5 h-3.5" />
              {t('openBot')}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralPage;
