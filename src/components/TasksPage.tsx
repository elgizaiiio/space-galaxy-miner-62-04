import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { 
  Gift, 
  CheckCircle, 
  ExternalLink, 
  Calendar, 
  Share2, 
  UserPlus,
  Pickaxe,
  Clock,
  Star
} from 'lucide-react';
import { getTranslation } from '../utils/language';

const TasksPage = () => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isTaskInProgress, setIsTaskInProgress] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  interface TaskWithImage {
    id: string;
    title: string;
    description: string;
    reward: number;
    icon: React.ComponentType<any>;
    category: 'daily' | 'social' | 'referral' | 'mining';
    action?: () => void;
    url?: string;
    progress?: number;
    maxProgress?: number;
    image?: string;
  }

  const tasks: TaskWithImage[] = [
    {
      id: 'daily-login',
      title: getTranslation('dailyLogin'),
      description: getTranslation('dailyLoginDesc'),
      reward: 50,
      icon: Calendar,
      category: 'daily'
    },
    {
      id: 'invite-friend',
      title: getTranslation('inviteFriend'),
      description: getTranslation('inviteFriendDesc'),
      reward: 100,
      icon: UserPlus,
      category: 'referral'
    },
    {
      id: 'share-app',
      title: getTranslation('shareApp'),
      description: getTranslation('shareAppDesc'),
      reward: 25,
      icon: Share2,
      category: 'social',
      url: 'https://t.me/share/url?url=https://example.com'
    },
    {
      id: 'mine-tokens',
      title: getTranslation('mineTokens'),
      description: getTranslation('mineTokensDesc'),
      reward: 75,
      icon: Pickaxe,
      category: 'mining',
      progress: 150,
      maxProgress: 500
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('completedTasks');
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  }, []);

  const handleTaskComplete = async (taskId: string, url?: string) => {
    if (completedTasks.includes(taskId) || isTaskInProgress[taskId]) {
      return;
    }

    setIsTaskInProgress(prev => ({ ...prev, [taskId]: true }));

    if (url) {
      window.open(url, '_blank');
    }

    setTimeout(() => {
      const newCompleted = [...completedTasks, taskId];
      setCompletedTasks(newCompleted);
      localStorage.setItem('completedTasks', JSON.stringify(newCompleted));
      
      const task = tasks.find(t => t.id === taskId);
      
      toast({
        title: getTranslation('taskCompleted'),
        description: `${getTranslation('earned')} ${task?.reward} $SPACE!`
      });

      setIsTaskInProgress(prev => ({ ...prev, [taskId]: false }));
    }, 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return Calendar;
      case 'social': return Share2;
      case 'referral': return UserPlus;
      case 'mining': return Pickaxe;
      default: return Gift;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily': return 'from-blue-500 to-cyan-600';
      case 'social': return 'from-purple-500 to-pink-600';
      case 'referral': return 'from-green-500 to-emerald-600';
      case 'mining': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const formatReward = (reward: number) => {
    return reward.toLocaleString();
  };

  return (
    <div 
      className="min-h-screen p-3 pb-24 relative"
      style={{
        backgroundImage: `url(/lovable-uploads/a886f619-aae7-4a46-b7ec-1dfcb2019fb0.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-md mx-auto space-y-4 relative z-10">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            {getTranslation('tasks')}
          </h1>
          <p className="text-gray-300 text-sm">
            {getTranslation('completeTasksEarn')}
          </p>
        </div>

        <div className="space-y-3">
          {tasks.map((task, index) => {
            const Icon = task.icon;
            const isCompleted = completedTasks.includes(task.id);
            const inProgress = isTaskInProgress[task.id];
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-xl border border-blue-400/20 rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${getCategoryColor(task.category)}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold text-sm">
                            {task.title}
                          </h3>
                          <Badge className={`text-xs px-2 py-0.5 bg-gradient-to-r ${getCategoryColor(task.category)}`}>
                            {task.category}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                          {task.description}
                        </p>
                        
                        {task.progress !== undefined && task.maxProgress && (
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>{getTranslation('progress')}</span>
                              <span>{task.progress}/{task.maxProgress}</span>
                            </div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                                style={{ width: `${(task.progress / task.maxProgress) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-bold text-sm">
                              +{formatReward(task.reward)} $SPACE
                            </span>
                          </div>
                          
                          <Button
                            onClick={() => handleTaskComplete(task.id, task.url)}
                            disabled={isCompleted || inProgress}
                            className={`text-xs py-1.5 px-3 rounded-lg ${
                              isCompleted 
                                ? 'bg-green-600 cursor-not-allowed' 
                                : inProgress
                                  ? 'bg-yellow-600 cursor-not-allowed'
                                  : `bg-gradient-to-r ${getCategoryColor(task.category)} hover:opacity-90`
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {getTranslation('completed')}
                              </>
                            ) : inProgress ? (
                              <>
                                <Clock className="w-3 h-3 mr-1 animate-spin" />
                                {getTranslation('inProgress')}
                              </>
                            ) : (
                              <>
                                {task.url && <ExternalLink className="w-3 h-3 mr-1" />}
                                {getTranslation('start')}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
