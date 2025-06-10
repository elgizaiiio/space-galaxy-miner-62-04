
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
    <div 
      className="min-h-screen text-white p-4 pb-24 relative overflow-hidden"
      style={{
        backgroundImage: `url('/lovable-uploads/a7b161e7-5f3d-4df4-a8de-6688660edee0.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-md mx-auto space-y-4 relative z-10">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="p-3 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-2xl backdrop-blur-sm border border-blue-500/30">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            {t('friends')}
          </h1>
          <p className="text-gray-300 text-sm">
            {t('inviteFriendsEarn')}
          </p>
        </div>

        {/* Compact Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {referralStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center">
                <Icon className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="text-white text-xs font-bold">{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Compact Instructions */}
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-lg text-center flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t('getReferralLink')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">1</div>
                <p className="text-gray-200">{t('goToBot')} @Spacelbot</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">2</div>
                <p className="text-gray-200">{t('sendCommand')}: <code className="bg-white/20 px-1 py-0.5 rounded text-white text-xs">/space</code></p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">3</div>
                <p className="text-gray-200">{t('receiveLink')}</p>
              </div>
            </div>
            
            <Button onClick={openTelegramBot} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl flex items-center justify-center gap-2 py-2">
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
