
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
  Star,
  Users,
  Wallet
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
  }

  const dailyTasks: TaskWithImage[] = [
    {
      id: 'daily-login',
      title: 'تسجيل الدخول اليومي',
      description: 'سجل دخولك يومياً واحصل على مكافآت',
      reward: 50,
      icon: Calendar,
      category: 'daily'
    },
    {
      id: 'daily-mine',
      title: 'تعدين يومي',
      description: 'قم بالتعدين لمدة 30 دقيقة',
      reward: 100,
      icon: Pickaxe,
      category: 'daily'
    }
  ];

  const socialTasks: TaskWithImage[] = [
    {
      id: 'follow-telegram',
      title: 'انضم إلى التليجرام',
      description: 'انضم إلى قناة التليجرام الرسمية',
      reward: 200,
      icon: Share2,
      category: 'social',
      url: 'https://t.me/spacecoin'
    },
    {
      id: 'follow-twitter',
      title: 'تابعنا على تويتر',
      description: 'تابع الحساب الرسمي على تويتر',
      reward: 150,
      icon: Share2,
      category: 'social',
      url: 'https://twitter.com/spacecoin'
    },
    {
      id: 'share-app',
      title: 'شارك التطبيق',
      description: 'شارك التطبيق مع أصدقائك',
      reward: 75,
      icon: Share2,
      category: 'social',
      url: 'https://t.me/share/url?url=https://example.com'
    }
  ];

  const referralTasks: TaskWithImage[] = [
    {
      id: 'invite-1-friend',
      title: 'ادع صديق واحد',
      description: 'ادع صديقاً واحداً للانضمام',
      reward: 500,
      icon: UserPlus,
      category: 'referral'
    },
    {
      id: 'invite-5-friends',
      title: 'ادع 5 أصدقاء',
      description: 'ادع 5 أصدقاء للانضمام',
      reward: 2500,
      icon: Users,
      category: 'referral'
    },
    {
      id: 'invite-10-friends',
      title: 'ادع 10 أصدقاء',
      description: 'ادع 10 أصدقاء للانضمام',
      reward: 10000,
      icon: Users,
      category: 'referral'
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
      
      const allTasks = [...dailyTasks, ...socialTasks, ...referralTasks];
      const task = allTasks.find(t => t.id === taskId);
      
      toast({
        title: 'تم إكمال المهمة!',
        description: `لقد حصلت على ${task?.reward} $SPACE!`
      });

      setIsTaskInProgress(prev => ({ ...prev, [taskId]: false }));
    }, 2000);
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

  const renderTaskSection = (title: string, tasks: TaskWithImage[], icon: React.ComponentType<any>) => {
    const Icon = icon;
    
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        
        <div className="space-y-3">
          {tasks.map((task, index) => {
            const TaskIcon = task.icon;
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
                        <TaskIcon className="w-6 h-6 text-white" />
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
                                مكتمل
                              </>
                            ) : inProgress ? (
                              <>
                                <Clock className="w-3 h-3 mr-1 animate-spin" />
                                جاري...
                              </>
                            ) : (
                              <>
                                {task.url && <ExternalLink className="w-3 h-3 mr-1" />}
                                ابدأ
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
    );
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
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            المهام
          </h1>
          <p className="text-gray-300 text-sm">
            أكمل المهام واحصل على $SPACE
          </p>
        </div>

        {renderTaskSection('المهام اليومية', dailyTasks, Calendar)}
        {renderTaskSection('وسائل التواصل الاجتماعي', socialTasks, Share2)}
        {renderTaskSection('دعوة الأصدقاء', referralTasks, UserPlus)}
      </div>
    </div>
  );
};

export default TasksPage;
