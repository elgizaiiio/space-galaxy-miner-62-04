
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Zap, TrendingUp, Star, Crown } from 'lucide-react';
import { getTranslation } from '../utils/language';

const MiningPage = () => {
  const [isMining, setIsMining] = useState(false);
  const [miningSpeed, setMiningSpeed] = useState(1.2);
  const [spaceBalance, setSpaceBalance] = useState(15420.5);
  const [miningRate] = useState(0.012);
  const [timeRemaining, setTimeRemaining] = useState(86400);
  const [streak, setStreak] = useState(7);

  const t = (key: string) => getTranslation(key);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMining) {
      interval = setInterval(() => {
        setSpaceBalance(prev => prev + miningRate);
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMining, miningRate]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMining = () => {
    setIsMining(!isMining);
  };

  const achievements = [
    { icon: Zap, title: 'Speed Booster', description: 'Mining at 2x speed', unlocked: true },
    { icon: TrendingUp, title: 'Profit Master', description: 'Earned 10,000 $SPACE', unlocked: true },
    { icon: Star, title: 'Daily Streak', description: '7 days in a row', unlocked: true },
    { icon: Crown, title: 'VIP Miner', description: 'Premium subscriber', unlocked: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-2 pb-20">
      <div className="max-w-md mx-auto space-y-2">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center mb-1">
            <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-0.5">
            {t('spaceMining')}
          </h1>
          <p className="text-gray-300 text-xs">
            {t('mineSpaceTokens')}
          </p>
        </div>

        {/* Main Balance Card */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-indigo-500/30 rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <div className="relative">
              <div className="flex items-center justify-center mb-2">
                <div className={`p-3 rounded-full transition-all duration-300 ${
                  isMining 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 animate-pulse-glow' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="text-center mb-3">
                <p className="text-xs text-gray-300 mb-1">{t('currentBalance')}</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-white animate-pulse">
                    {spaceBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-blue-300 font-medium">$SPACE</span>
                </div>
              </div>

              <Button 
                onClick={toggleMining} 
                size="lg" 
                className={`w-full h-12 text-base font-bold rounded-xl transition-all duration-300 ${
                  isMining 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                {isMining ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    {t('stopMining')}
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    {t('startMining')}
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Mining Stats - Compact Grid */}
        <div className="grid grid-cols-2 gap-2">
          <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border border-green-500/40 rounded-xl">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-green-200 font-medium">{t('miningRate')}</p>
              <p className="text-sm font-bold text-white">{miningRate}/sec</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/15 to-cyan-500/15 backdrop-blur-xl border border-blue-500/40 rounded-xl">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-blue-200 font-medium">{t('miningSpeed')}</p>
              <p className="text-sm font-bold text-white">{miningSpeed}x</p>
            </CardContent>
          </Card>
        </div>

        {/* Mining Timer */}
        {isMining && (
          <Card className="bg-gradient-to-br from-orange-500/15 to-red-500/15 backdrop-blur-xl border border-orange-500/40 rounded-xl">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-orange-200 font-medium text-sm">{t('timeRemaining')}</span>
                <span className="font-bold text-white text-sm">{formatTime(timeRemaining)}</span>
              </div>
              <div className="w-full bg-orange-900/30 rounded-full h-1.5 mt-2">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-red-500 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${((86400 - timeRemaining) / 86400) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Streak */}
        <Card className="bg-gradient-to-br from-yellow-500/15 to-orange-500/15 backdrop-blur-xl border border-yellow-500/40 rounded-xl">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-200 font-medium text-sm">{t('dailyStreak')}</span>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">
                {streak} {t('days')}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-gradient-to-br from-purple-500/15 to-pink-500/15 backdrop-blur-xl border border-purple-500/40 rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Crown className="w-4 h-4" />
              {t('achievements')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-3">
            <div className="grid grid-cols-2 gap-2">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={index} className={`p-2 rounded-lg border ${
                    achievement.unlocked 
                      ? 'bg-purple-500/20 border-purple-500/50' 
                      : 'bg-gray-500/10 border-gray-500/30'
                  }`}>
                    <Icon className={`w-4 h-4 mx-auto mb-1 ${
                      achievement.unlocked ? 'text-purple-400' : 'text-gray-500'
                    }`} />
                    <p className={`text-xs text-center font-medium ${
                      achievement.unlocked ? 'text-purple-200' : 'text-gray-400'
                    }`}>
                      {achievement.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MiningPage;
