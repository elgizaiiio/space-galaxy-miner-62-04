
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Share2, Copy, Gift, Star, Trophy, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateReferralLink, getTelegramUser } from '@/utils/telegram';

const ReferralPage = () => {
  const { toast } = useToast();
  const [referredUsers] = useState(12);
  const [totalEarnings] = useState(24000);
  
  const user = getTelegramUser();
  const referralLink = user ? generateReferralLink(user.id) : 'https://t.me/Spacelbot?start=123456';

  const leaderboard = [
    { rank: 1, name: 'أحمد المصري', referrals: 156, icon: <Crown className="w-5 h-5 text-yellow-400" /> },
    { rank: 2, name: 'فاطمة السعودية', referrals: 134, icon: <Trophy className="w-5 h-5 text-gray-400" /> },
    { rank: 3, name: 'محمد الإماراتي', referrals: 98, icon: <Trophy className="w-5 h-5 text-orange-400" /> },
    { rank: 4, name: 'أنت', referrals: referredUsers, icon: <Star className="w-5 h-5 text-blue-400" /> },
  ];

  const rewards = [
    { milestone: 5, reward: 5000, claimed: true },
    { milestone: 10, reward: 12000, claimed: true },
    { milestone: 25, reward: 30000, claimed: false },
    { milestone: 50, reward: 75000, claimed: false },
    { milestone: 100, reward: 200000, claimed: false },
  ];

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ رابط الدعوة إلى الحافظة",
    });
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '$SPACE Mining - انضم إلي!',
          text: 'انضم إلي في تعدين $SPACE واحصل على مكافآت رائعة!',
          url: referralLink,
        });
      } catch (error) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent mb-2">
            دعوة الأصدقاء
          </h1>
          <p className="text-gray-300">ادع أصدقاءك واحصل على مكافآت مضاعفة</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white">الأصدقاء المدعوين</h3>
              <p className="text-2xl font-bold text-blue-400">{referredUsers}</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Gift className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white">إجمالي الأرباح</h3>
              <p className="text-2xl font-bold text-green-400">{totalEarnings.toLocaleString()} $SPACE</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-white">ترتيبك</h3>
              <p className="text-2xl font-bold text-yellow-400">#4</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="text-white text-center">رابط الدعوة الخاص بك</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
              <code className="text-sm text-gray-300 flex-1 break-all">
                {referralLink}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyReferralLink}
                className="text-gray-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={copyReferralLink} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Copy className="w-4 h-4 mr-2" />
                نسخ الرابط
              </Button>
              <Button onClick={shareReferralLink} className="space-button">
                <Share2 className="w-4 h-4 mr-2" />
                مشاركة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reward Milestones */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">معالم المكافآت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rewards.map((reward, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                reward.claimed ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    reward.claimed ? 'bg-green-500' : referredUsers >= reward.milestone ? 'bg-yellow-500' : 'bg-gray-600'
                  }`}>
                    {reward.claimed ? '✓' : reward.milestone}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {reward.milestone} أصدقاء
                    </p>
                    <p className="text-gray-400 text-sm">
                      +{reward.reward.toLocaleString()} $SPACE
                    </p>
                  </div>
                </div>
                <Button
                  disabled={referredUsers < reward.milestone || reward.claimed}
                  className={`${
                    reward.claimed
                      ? 'bg-green-600 hover:bg-green-600'
                      : referredUsers >= reward.milestone
                      ? 'space-button'
                      : 'bg-gray-600 hover:bg-gray-600'
                  }`}
                >
                  {reward.claimed ? 'مُستلمة' : referredUsers >= reward.milestone ? 'استلام' : 'مقفلة'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white">لوحة المتصدرين</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaderboard.map((user, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg ${
                user.name === 'أنت' ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {user.icon}
                    <span className="text-white font-bold">#{user.rank}</span>
                  </div>
                  <p className="text-white font-medium">{user.name}</p>
                </div>
                <p className="text-gray-300">{user.referrals} دعوة</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralPage;
