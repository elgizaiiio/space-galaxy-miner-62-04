
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Users, Gift, Star, Clock } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { getStoredLanguage, getTranslation } from '../utils/language';
import { useToast } from '@/hooks/use-toast';

const ContestsPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [weeklyTimeLeft, setWeeklyTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [dailyParticipants] = useState(1247);
  const [weeklyParticipants] = useState(8934);
  const [lastWeeklyWinner] = useState('Ahmed Mohammed');
  const [dailyJoined, setDailyJoined] = useState(false);
  const [weeklyJoined, setWeeklyJoined] = useState(false);
  const { toast } = useToast();

  // Get translation function for current language
  const t = (key: string) => getTranslation(key, currentLanguage.code);

  // Calculate time left for daily contest (resets at midnight)
  useEffect(() => {
    const updateDailyTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
    };

    // Calculate time left for weekly contest (resets on Sunday)
    const updateWeeklyTimer = () => {
      const now = new Date();
      const nextSunday = new Date(now);
      const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
      nextSunday.setDate(now.getDate() + daysUntilSunday);
      nextSunday.setHours(0, 0, 0, 0);
      
      const diff = nextSunday.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setWeeklyTimeLeft({ days, hours, minutes });
    };

    updateDailyTimer();
    updateWeeklyTimer();
    
    const interval = setInterval(() => {
      updateDailyTimer();
      updateWeeklyTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleJoinDailyContest = () => {
    if (dailyJoined) {
      toast({
        title: t('alreadyJoined') || 'Already Joined',
        description: t('alreadyJoinedDaily') || 'You have already joined today\'s contest',
      });
      return;
    }

    setDailyJoined(true);
    toast({
      title: t('joinedSuccessfully') || 'Joined Successfully!',
      description: t('joinedDailyContest') || 'You have joined the daily contest. Good luck!',
    });
    
    console.log('Joining daily contest');
  };

  const handleJoinWeeklyContest = () => {
    if (weeklyJoined) {
      toast({
        title: t('alreadyJoined') || 'Already Joined',
        description: t('alreadyJoinedWeekly') || 'You have already joined this week\'s contest',
      });
      return;
    }

    setWeeklyJoined(true);
    toast({
      title: t('joinedSuccessfully') || 'Joined Successfully!',
      description: t('joinedWeeklyContest') || 'You have joined the weekly contest. Good luck!',
    });
    
    console.log('Joining weekly contest');
  };

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
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full shadow-2xl animate-pulse-glow">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-3">
              {t('contests') || 'Contests'}
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">
              {t('joinContestsWinPrizes') || 'Join contests and win amazing prizes'}
            </p>
          </div>
        </div>

        {/* Daily Contest */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-blue-500/30 rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-xl text-center flex items-center justify-center gap-2">
              <Calendar className="w-6 h-6" />
              {t('dailyContest') || 'Daily Contest'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">1 TON</div>
              <p className="text-gray-300 text-sm">{t('dailyPrize') || 'Daily Prize'}</p>
            </div>

            {/* Timer */}
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-gray-300 text-sm text-center mb-2">{t('timeLeft') || 'Time Left'}</p>
              <div className="flex justify-center items-center gap-2 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">{t('hours') || 'Hours'}</div>
                </div>
                <div className="text-blue-400 text-xl">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">{t('minutes') || 'Minutes'}</div>
                </div>
                <div className="text-blue-400 text-xl">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">{t('seconds') || 'Seconds'}</div>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <Users className="w-4 h-4" />
              <span className="text-sm">{dailyParticipants.toLocaleString()} {t('participants') || 'participants'}</span>
            </div>

            {/* How to increase chances */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                {t('increaseChances') || 'Increase Your Chances'}
              </h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {t('inviteFriends') || 'Invite friends'}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {t('completeTasks') || 'Complete tasks'}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  {t('dailyMining') || 'Daily mining activity'}
                </li>
              </ul>
            </div>

            <Button 
              onClick={handleJoinDailyContest}
              disabled={dailyJoined}
              className={`w-full rounded-2xl ${
                dailyJoined 
                  ? 'bg-green-600 hover:bg-green-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              <Gift className="w-4 h-4 mr-2" />
              {dailyJoined ? (t('joined') || 'Joined') : (t('joinContest') || 'Join Contest')}
            </Button>
          </CardContent>
        </Card>

        {/* Weekly Contest */}
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border-2 border-yellow-500/30 rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-xl text-center flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6" />
              {t('weeklyContest') || 'Weekly Contest'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">100 TON</div>
              <p className="text-gray-300 text-sm">{t('weeklyPrize') || 'Weekly Prize'}</p>
            </div>

            {/* Weekly Timer */}
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-gray-300 text-sm text-center mb-2">{t('timeLeft') || 'Time Left'}</p>
              <div className="flex justify-center items-center gap-2 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{weeklyTimeLeft.days}</div>
                  <div className="text-xs text-gray-400">{t('days') || 'Days'}</div>
                </div>
                <div className="text-yellow-400 text-xl">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{weeklyTimeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">{t('hours') || 'Hours'}</div>
                </div>
                <div className="text-yellow-400 text-xl">:</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{weeklyTimeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">{t('minutes') || 'Minutes'}</div>
                </div>
              </div>
            </div>

            {/* Weekly Participants */}
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <Users className="w-4 h-4" />
              <span className="text-sm">{weeklyParticipants.toLocaleString()} {t('participants') || 'participants'}</span>
            </div>

            {/* Last Winner */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 text-center">
              <p className="text-gray-300 text-sm mb-1">{t('lastWeekWinner') || 'Last Week Winner'}</p>
              <p className="text-yellow-400 font-bold text-lg">{lastWeeklyWinner}</p>
            </div>

            <Button 
              onClick={handleJoinWeeklyContest}
              disabled={weeklyJoined}
              className={`w-full rounded-2xl ${
                weeklyJoined 
                  ? 'bg-green-600 hover:bg-green-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
              }`}
            >
              <Trophy className="w-4 h-4 mr-2" />
              {weeklyJoined ? (t('joined') || 'Joined') : (t('joinContest') || 'Join Contest')}
            </Button>
          </CardContent>
        </Card>

        {/* Contest Rules */}
        <Card className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 backdrop-blur-xl border-2 border-gray-500/30 rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-white text-lg text-center">
              {t('contestRules') || 'Contest Rules'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                <p>{t('rule1') || 'Winners are selected randomly from all participants'}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                <p>{t('rule2') || 'Complete tasks and invite friends to increase your chances'}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                <p>{t('rule3') || 'Prizes are distributed automatically to winners'}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                <p>{t('rule4') || 'Each user can participate once per contest period'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContestsPage;
