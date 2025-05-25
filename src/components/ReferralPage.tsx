
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ExternalLink, Gift, Sparkles, Zap } from 'lucide-react';

const ReferralPage = () => {
  const openTelegramBot = () => {
    window.open('https://t.me/Spacelbot', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
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

        {/* Instructions Card */}
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
          <CardHeader className="pb-4 relative">
            <CardTitle className="text-white text-center text-xl font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-400" />
              كيفية الحصول على رابط الإحالة
              <Sparkles className="w-6 h-6 text-purple-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-6 relative">
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-black/30 rounded-2xl border border-white/10">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-2">ادخل إلى البوت</p>
                  <p className="text-gray-300 text-sm">
                    اضغط على الزر أدناه للدخول إلى 
                    <span className="text-pink-400 font-mono mx-1">@Spacelbot</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-black/30 rounded-2xl border border-white/10">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-2">اكتب الأمر</p>
                  <p className="text-gray-300 text-sm mb-2">اكتب الأمر التالي في البوت:</p>
                  <code className="bg-black/50 text-pink-400 px-3 py-2 rounded-lg text-sm font-mono">
                    /Referral
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-black/30 rounded-2xl border border-white/10">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-2">احصل على الرابط</p>
                  <p className="text-gray-300 text-sm">
                    سيرسل لك البوت رابط الإحالة الخاص بك فوراً
                  </p>
                </div>
              </div>
            </div>

            <Button 
              onClick={openTelegramBot}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-14 text-base rounded-2xl shadow-xl"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              افتح @Spacelbot
            </Button>
          </CardContent>
        </Card>

        {/* Rewards Information */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-center text-xl font-bold flex items-center justify-center gap-2">
              <Gift className="w-6 h-6 text-yellow-400" />
              مكافآت الإحالة
              <Gift className="w-6 h-6 text-yellow-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            <div className="text-center space-y-4">
              <div className="p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30">
                <div className="flex items-center justify-center mb-3">
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">50% مكافأة</h3>
                <p className="text-gray-300 text-base">
                  ستحصل على 50% مكافأة إضافية من كل صديق تدعوه وقت الايردروب
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/30 rounded-xl border border-white/10 text-center">
                  <p className="text-pink-400 font-bold text-lg">لك</p>
                  <p className="text-gray-300 text-sm">مكافأة إضافية</p>
                </div>
                <div className="p-4 bg-black/30 rounded-xl border border-white/10 text-center">
                  <p className="text-purple-400 font-bold text-lg">لصديقك</p>
                  <p className="text-gray-300 text-sm">بونص ترحيبي</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Note */}
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/30">
          <p className="text-center text-gray-300 text-sm leading-relaxed">
            <span className="text-blue-400 font-semibold">ملاحظة:</span>
            {" "}كلما زاد عدد الأصدقاء الذين تدعوهم، كلما زادت مكافآتك في الايردروب القادم
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralPage;
