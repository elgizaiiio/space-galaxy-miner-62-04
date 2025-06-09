
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl animate-pulse-glow">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              {t('friends')}
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">
              {t('inviteFriendsEarn')}
            </p>
          </div>
        </div>

        {/* Get Referral Link Instructions */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-indigo-500/30 rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-xl text-center flex items-center justify-center gap-2">
              <MessageSquare className="w-6 h-6" />
              {t('getReferralLink')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                <p className="text-zinc-50">{t('goToBot')} @Spacelbot {t('onTelegram')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                <p className="text-zinc-50">{t('sendCommand')}: <code className="bg-white/10 px-2 py-1 rounded text-white">/space</code></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                <p className="text-zinc-50">{t('receiveLink')}</p>
              </div>
            </div>
            
            <Button onClick={openTelegramBot} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {t('openBot')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralPage;
