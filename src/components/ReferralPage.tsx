
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Gift, Copy, Share2, UserPlus, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LanguageSwitcher from './LanguageSwitcher';
import { getStoredLanguage, getTranslation } from '../utils/language';

const ReferralPage = () => {
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [referralCode] = useState('SPACE2024');
  const [referredUsers] = useState(12);
  const [totalEarned] = useState(2400);

  // Get translation function for current language
  const t = (key: string) => getTranslation(key, currentLanguage.code);

  const copyReferralLink = () => {
    const referralLink = `https://space-mining-app.com/ref/${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: t('copied') || 'Copied!',
      description: t('referralLinkCopied') || 'Referral link copied to clipboard'
    });
  };

  const shareReferralLink = () => {
    const referralLink = `https://space-mining-app.com/ref/${referralCode}`;
    const shareText = t('shareText') || `Join me on Space Mining App and start earning $SPACE coins! Use my referral code: ${referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: t('shareTitleApp') || 'Space Mining App',
        text: shareText,
        url: referralLink
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyReferralLink();
    }
  };

  const referralStats = [
    {
      icon: Users,
      label: t('totalReferrals') || 'Total Referrals',
      value: referredUsers,
      color: 'blue'
    },
    {
      icon: Gift,
      label: t('totalEarned') || 'Total Earned',
      value: `${totalEarned} $SPACE`,
      color: 'green'
    },
    {
      icon: TrendingUp,
      label: t('earningsPerReferral') || 'Per Referral',
      value: '200 $SPACE',
      color: 'purple'
    }
  ];

  const recentReferrals = [
    { name: t('user') + ' #1', joined: t('today') || 'Today', earned: 200 },
    { name: t('user') + ' #2', joined: t('yesterday') || 'Yesterday', earned: 200 },
    { name: t('user') + ' #3', joined: '2 ' + (t('daysAgo') || 'days ago'), earned: 200 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative">
            {/* Language Switcher */}
            <div className="absolute top-0 right-0">
              <LanguageSwitcher onLanguageChange={() => setCurrentLanguage(getStoredLanguage())} />
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl animate-pulse-glow">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              {t('friends') || 'Friends'}
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">
              {t('inviteFriendsEarn') || 'Invite friends and earn $SPACE coins together'}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          {referralStats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'from-blue-500/15 to-indigo-500/15 border-blue-500/40 text-blue-400',
              green: 'from-green-500/15 to-emerald-500/15 border-green-500/40 text-green-400',
              purple: 'from-purple-500/15 to-pink-500/15 border-purple-500/40 text-purple-400'
            };
            
            return (
              <Card 
                key={index} 
                className={`bg-gradient-to-br backdrop-blur-xl border-2 rounded-3xl overflow-hidden ${colorClasses[stat.color as keyof typeof colorClasses].split(' ').slice(0, 3).join(' ')}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">{stat.label}</p>
                      <p className="text-white text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color === 'blue' ? 'bg-blue-500/20' : stat.color === 'green' ? 'bg-green-500/20' : 'bg-purple-500/20'}`}>
                      <Icon className={`w-8 h-8 ${colorClasses[stat.color as keyof typeof colorClasses].split(' ').slice(-1)[0]}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Referral Code Card */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-indigo-500/30 rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-xl text-center">
              {t('yourReferralCode') || 'Your Referral Code'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <code className="text-2xl font-bold text-white tracking-wider">{referralCode}</code>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={copyReferralLink}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl"
              >
                <Copy className="w-4 h-4 mr-2" />
                {t('copy') || 'Copy'}
              </Button>
              
              <Button 
                onClick={shareReferralLink}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-2xl"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {t('share') || 'Share'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border-2 border-green-500/30 rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-xl text-center flex items-center justify-center gap-2">
              <UserPlus className="w-6 h-6" />
              {t('howItWorks') || 'How It Works'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                <p className="text-gray-300">{t('step1') || 'Share your referral code with friends'}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                <p className="text-gray-300">{t('step2') || 'They join using your code'}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                <p className="text-gray-300">{t('step3') || 'You both earn 200 $SPACE coins!'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Referrals */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-purple-500/30 rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-xl">{t('recentReferrals') || 'Recent Referrals'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReferrals.map((referral, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-medium">{referral.name}</p>
                  <p className="text-gray-400 text-sm">{t('joined') || 'Joined'} {referral.joined}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">+{referral.earned} $SPACE</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralPage;
