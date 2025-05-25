
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Star, Trophy, Gift, Users, Share2, Heart } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { getStoredLanguage, getTranslation } from '../utils/language';

const TasksPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  // Get translation function for current language
  const t = (key: string) => getTranslation(key, currentLanguage.code);

  const tasks = [
    {
      id: 'daily_login',
      title: t('dailyLogin') || 'Daily Login',
      description: t('loginDaily') || 'Login to the app daily to earn rewards',
      reward: 100,
      type: 'daily',
      icon: Star,
      difficulty: 'Easy'
    },
    {
      id: 'invite_friends',
      title: t('inviteFriends') || 'Invite Friends',
      description: t('inviteFriendsDesc') || 'Invite 5 friends to join the platform',
      reward: 500,
      type: 'social',
      icon: Users,
      difficulty: 'Medium'
    },
    {
      id: 'share_app',
      title: t('shareApp') || 'Share App',
      description: t('shareAppDesc') || 'Share the app on social media',
      reward: 200,
      type: 'social',
      icon: Share2,
      difficulty: 'Easy'
    },
    {
      id: 'complete_mining',
      title: t('completeMining') || 'Complete Mining Session',
      description: t('completeMiningDesc') || 'Complete a full 8-hour mining session',
      reward: 1000,
      type: 'mining',
      icon: Trophy,
      difficulty: 'Hard'
    },
    {
      id: 'wallet_connect',
      title: t('connectWallet') || 'Connect Wallet',
      description: t('connectWalletDesc') || 'Connect your TON wallet to the app',
      reward: 300,
      type: 'wallet',
      icon: Gift,
      difficulty: 'Easy'
    }
  ];

  const handleCompleteTask = (taskId: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-300';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'Hard': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-500/20 text-blue-300';
      case 'social': return 'bg-purple-500/20 text-purple-300';
      case 'mining': return 'bg-orange-500/20 text-orange-300';
      case 'wallet': return 'bg-pink-500/20 text-pink-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
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
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl animate-pulse-glow">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              {t('tasks') || 'Tasks'}
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">
              {t('completeTasksEarn') || 'Complete tasks to earn $SPACE coins'}
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border-2 border-green-500/40 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">{t('tasksCompleted') || 'Tasks Completed'}</p>
                <p className="text-white text-2xl font-bold">{completedTasks.length}/{tasks.length}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => {
            const Icon = task.icon;
            const isCompleted = completedTasks.includes(task.id);
            
            return (
              <Card 
                key={task.id} 
                className={`bg-gradient-to-br backdrop-blur-xl border-2 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                  isCompleted 
                    ? 'from-green-500/15 to-emerald-500/15 border-green-500/40' 
                    : 'from-indigo-500/10 to-purple-500/10 border-indigo-500/30'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${isCompleted ? 'bg-green-500/20' : 'bg-indigo-500/20'}`}>
                        <Icon className={`w-6 h-6 ${isCompleted ? 'text-green-400' : 'text-indigo-400'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{task.title}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getDifficultyColor(task.difficulty)}>
                            {t(task.difficulty.toLowerCase()) || task.difficulty}
                          </Badge>
                          <Badge className={getTypeColor(task.type)}>
                            {t(task.type) || task.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {isCompleted && <CheckCircle className="w-6 h-6 text-green-400" />}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-300 text-sm mb-4">{task.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span className="text-pink-400 font-bold">+{task.reward} $SPACE</span>
                    </div>
                    
                    <Button
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={isCompleted}
                      className={`${
                        isCompleted 
                          ? 'bg-green-500/20 text-green-300 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                      } rounded-xl`}
                      size="sm"
                    >
                      {isCompleted ? t('completed') || 'Completed' : t('complete') || 'Complete'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
