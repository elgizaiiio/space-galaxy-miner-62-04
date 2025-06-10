
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  ExternalLink, 
  Calendar, 
  Share2, 
  UserPlus,
  Pickaxe,
  Clock,
  Star,
  Users,
  Wallet,
  Gift,
  Handshake
} from 'lucide-react';

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
    category: 'basic' | 'partner' | 'daily';
    action?: () => void;
    url?: string;
  }

  // Basic Tasks
  const basicTasks: TaskWithImage[] = [
    {
      id: 'connect-wallet',
      title: 'ربط المحفظة',
      description: 'اربط محفظة TON الخاصة بك',
      reward: 500,
      icon: Wallet,
      category: 'basic'
    },
    {
      id: 'first-mine',
      title: 'التعدين الأول',
      description: 'ابدأ عملية التعدين لأول مرة',
      reward: 250,
      icon: Pickaxe,
      category: 'basic'
    },
    {
      id: 'complete-profile',
      title: 'إكمال الملف الشخصي',
      description: 'أكمل معلومات ملفك الشخصي',
      reward: 300,
      icon: UserPlus,
      category: 'basic'
    }
  ];

  // Partner Tasks
  const partnerTasks: TaskWithImage[] = [
    {
      id: 'follow-telegram',
      title: 'انضم للتليجرام',
      description: 'انضم لقناة التليجرام الرسمية',
      reward: 200,
      icon: Share2,
      category: 'partner',
      url: 'https://t.me/spacecoin'
    },
    {
      id: 'follow-twitter',
      title: 'تابع تويتر',
      description: 'تابع الحساب الرسمي على تويتر',
      reward: 150,
      icon: Share2,
      category: 'partner',
      url: 'https://twitter.com/spacecoin'
    },
    {
      id: 'youtube-subscribe',
      title: 'اشترك باليوتيوب',
      description: 'اشترك في القناة الرسمية',
      reward: 175,
      icon: Share2,
      category: 'partner',
      url: 'https://youtube.com/spacecoin'
    }
  ];

  // Daily Tasks
  const dailyTasks: TaskWithImage[] = [
    {
      id: 'daily-login',
      title: 'تسجيل دخول يومي',
      description: 'سجل دخولك يومياً',
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
    },
    {
      id: 'daily-share',
      title: 'مشاركة يومية',
      description: 'شارك التطبيق مع الأصدقاء',
      reward: 75,
      icon: Share2,
      category: 'daily'
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
      
      const allTasks = [...basicTasks, ...partnerTasks, ...dailyTasks];
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
      case 'basic': return 'from-green-500 to-emerald-600';
      case 'partner': return 'from-purple-500 to-pink-600';
      case 'daily': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const formatReward = (reward: number) => {
    return reward.toLocaleString();
  };

  const renderTaskCard = (task: TaskWithImage) => {
    const TaskIcon = task.icon;
    const isCompleted = completedTasks.includes(task.id);
    const inProgress = isTaskInProgress[task.id];
    
    return (
      <Card key={task.id} className="bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-xl border border-blue-400/20 rounded-xl">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-gradient-to-r ${getCategoryColor(task.category)} flex-shrink-0`}>
              <TaskIcon className="w-4 h-4 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">
                {task.title}
              </h3>
              <p className="text-gray-300 text-xs mb-2 line-clamp-1">
                {task.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-xs">
                    +{formatReward(task.reward)}
                  </span>
                </div>
                
                <Button
                  onClick={() => handleTaskComplete(task.id, task.url)}
                  disabled={isCompleted || inProgress}
                  size="sm"
                  className={`text-xs py-1 px-2 h-7 ${
                    isCompleted 
                      ? 'bg-green-600 cursor-not-allowed' 
                      : inProgress
                        ? 'bg-yellow-600 cursor-not-allowed'
                        : `bg-gradient-to-r ${getCategoryColor(task.category)} hover:opacity-90`
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : inProgress ? (
                    <Clock className="w-3 h-3 animate-spin" />
                  ) : (
                    task.url ? <ExternalLink className="w-3 h-3" /> : <Gift className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
            المهام
          </h1>
          <p className="text-gray-300 text-sm">
            أكمل المهام واحصل على $SPACE
          </p>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-blue-400/30 mb-4">
            <TabsTrigger 
              value="basic" 
              className="text-xs data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              أساسية
            </TabsTrigger>
            <TabsTrigger 
              value="partner" 
              className="text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              <Handshake className="w-3 h-3 mr-1" />
              شركاء
            </TabsTrigger>
            <TabsTrigger 
              value="daily" 
              className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              <Calendar className="w-3 h-3 mr-1" />
              يومية
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-3">
            {basicTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {renderTaskCard(task)}
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="partner" className="space-y-3">
            {partnerTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {renderTaskCard(task)}
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="daily" className="space-y-3">
            {dailyTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {renderTaskCard(task)}
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TasksPage;
