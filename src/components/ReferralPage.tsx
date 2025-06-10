
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, ArrowRight } from 'lucide-react';
import { getTranslation } from '../utils/language';

const ReferralPage = () => {
  const t = (key: string) => getTranslation(key);
  
  const openTelegramBot = () => {
    window.open('https://t.me/Spacelbot', '_blank');
  };

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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-3xl backdrop-blur-sm border border-blue-500/30">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            {t('friends')}
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            {t('inviteFriendsEarn')}
          </p>
        </div>

        {/* Instructions Card */}
        <Card className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-xl text-center flex items-center justify-center gap-3">
              <MessageSquare className="w-6 h-6" />
              {t('getReferralLink')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-base">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
                <p className="text-gray-200">{t('goToBot')} @Spacelbot</p>
              </div>
              <div className="flex items-center gap-3 text-base">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
                <p className="text-gray-200">{t('sendCommand')}: <code className="bg-white/20 px-2 py-1 rounded text-white text-sm">/space</code></p>
              </div>
              <div className="flex items-center gap-3 text-base">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</div>
                <p className="text-gray-200">{t('receiveLink')}</p>
              </div>
            </div>
            
            <Button onClick={openTelegramBot} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl flex items-center justify-center gap-3 py-3 text-base font-semibold">
              <MessageSquare className="w-5 h-5" />
              {t('openBot')}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralPage;
