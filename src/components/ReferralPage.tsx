import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Share2, Copy, Gift, Star, Trophy, Crown, Sparkles, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateReferralLink, getTelegramUser } from '@/utils/telegram';
const ReferralPage = () => {
  const {
    toast
  } = useToast();
  const [referredUsers] = useState(12);
  const [totalEarnings] = useState(24000);
  const user = getTelegramUser();
  const referralLink = user ? generateReferralLink(user.id) : 'https://t.me/Spacelbot?start=123456';
  const leaderboard = [{
    rank: 1,
    name: 'أحمد المصري',
    referrals: 156,
    icon: <Crown className="w-5 h-5 text-yellow-400" />
  }, {
    rank: 2,
    name: 'فاطمة السعودية',
    referrals: 134,
    icon: <Trophy className="w-5 h-5 text-gray-300" />
  }, {
    rank: 3,
    name: 'محمد الإماراتي',
    referrals: 98,
    icon: <Trophy className="w-5 h-5 text-amber-600" />
  }, {
    rank: 4,
    name: 'أنت',
    referrals: referredUsers,
    icon: <Star className="w-5 h-5 text-blue-400" />
  }];
  const rewards = [{
    milestone: 5,
    reward: 5000,
    claimed: true
  }, {
    milestone: 10,
    reward: 12000,
    claimed: true
  }, {
    milestone: 25,
    reward: 30000,
    claimed: false
  }, {
    milestone: 50,
    reward: 75000,
    claimed: false
  }, {
    milestone: 100,
    reward: 200000,
    claimed: false
  }];
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ رابط الدعوة إلى الحافظة"
    });
  };
  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '$SPACE Mining - انضم إلي!',
          text: 'انضم إلي في تعدين $SPACE واحصل على مكافآت رائعة!',
          url: referralLink
        });
      } catch (error) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
              دعوة الأصدقاء
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">ادع أصدقاءك واحصل على مكافآت مضاعفة</p>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        

        {/* Enhanced Referral Link Card */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
          <CardHeader className="pb-4 relative">
            <CardTitle className="text-white text-center text-xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-400" />
              رابط الدعوة الخاص بك
              <Sparkles className="w-6 h-6 text-purple-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-6 relative">
            <div className="flex items-center gap-3 p-4 bg-black/30 rounded-2xl border border-white/10">
              <code className="text-sm text-gray-200 flex-1 break-all leading-relaxed font-mono">
                {referralLink}
              </code>
              <Button variant="ghost" size="sm" onClick={copyReferralLink} className="text-purple-400 hover:text-white hover:bg-purple-500/20 h-10 w-10 p-0 flex-shrink-0 rounded-xl">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={copyReferralLink} variant="outline" className="border-purple-400/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 h-14 text-base rounded-2xl">
                <Copy className="w-5 h-5 mr-2" />
                نسخ الرابط
              </Button>
              <Button onClick={shareReferralLink} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-14 text-base rounded-2xl shadow-xl">
                <Share2 className="w-5 h-5 mr-2" />
                مشاركة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Reward Milestones */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              معالم المكافآت
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {rewards.map((reward, index) => <div key={index} className="">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${reward.claimed ? 'bg-green-500 text-white shadow-lg' : referredUsers >= reward.milestone ? 'bg-yellow-500 text-black shadow-lg' : 'bg-gray-600 text-gray-300'}`}>
                    {reward.claimed ? '✓' : reward.milestone}
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">
                      {reward.milestone} أصدقاء
                    </p>
                    <p className="text-gray-300 text-sm">
                      +{reward.reward.toLocaleString()} $SPACE
                    </p>
                  </div>
                </div>
                <Button disabled={referredUsers < reward.milestone || reward.claimed} className={`h-10 px-6 text-sm font-bold rounded-xl transition-all duration-300 ${reward.claimed ? 'bg-green-600 hover:bg-green-600 text-white' : referredUsers >= reward.milestone ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black shadow-lg' : 'bg-gray-600 hover:bg-gray-600 text-gray-300'}`}>
                  {reward.claimed ? 'مُستلمة' : referredUsers >= reward.milestone ? 'استلام' : 'مقفلة'}
                </Button>
              </div>)}
          </CardContent>
        </Card>

        {/* Enhanced Leaderboard */}
        
      </div>
    </div>;
};
export default ReferralPage;