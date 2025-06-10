
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { useUserData } from '@/hooks/useUserData';
import { tonService } from '@/services/tonService';
import { getTranslation } from '../utils/language';
import { 
  CheckCircle, 
  ExternalLink, 
  Calendar, 
  Share2, 
  UserPlus,
  Pickaxe,
  Clock,
  Users,
  Wallet,
  Gift,
  Handshake
} from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];

const TasksPage = () => {
  const [isTaskInProgress, setIsTaskInProgress] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();
  
  // Get real tasks from database
  const { tasks, isLoading: tasksLoading, checkTaskCompletion } = useTaskManagement();
  
  // Mock user data - in real app this would come from authentication
  const mockTelegramUserId = "123456789"; // Convert to string
  const { userProfile, completedTasks, completeTask, isLoading: userLoading } = useUserData(mockTelegramUserId);

  const getTaskIcon = (status: string) => {
    switch (status) {
      case 'pending': return Calendar;
      case 'in_progress': return Clock;
      case 'completed': return CheckCircle;
      case 'failed': return Share2;
      default: return Gift;
    }
  };

  const getCategoryColor = (status: string) => {
    switch (status) {
      case 'pending': return 'from-yellow-500 to-orange-600';
      case 'in_progress': return 'from-blue-500 to-cyan-600';
      case 'completed': return 'from-green-500 to-emerald-600';
      case 'failed': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const formatReward = (reward: number) => {
    return reward.toLocaleString();
  };

  const handleTaskClick = (task: Task) => {
    // If task has external link, open it in new tab
    if (task.external_link) {
      window.open(task.external_link, '_blank');
    }
  };

  const handleTaskComplete = async (task: Task) => {
    if (!userProfile || isTaskInProgress[task.id]) {
      return;
    }

    // Check if task is already completed
    const isCompleted = completedTasks.some(ct => ct.task_id === task.id);
    if (isCompleted) {
      toast({
        title: getTranslation('taskCompleted'),
        description: 'هذه المهمة مكتملة بالفعل',
        variant: 'destructive'
      });
      return;
    }

    setIsTaskInProgress(prev => ({ ...prev, [task.id]: true }));

    try {
      // Handle daily check-in task (requires TON payment)
      if (task.title === 'daily check-in' && task.status === 'pending') {
        try {
          // Check wallet connection
          if (!tonService.isWalletConnected()) {
            const walletAddress = await tonService.connectWallet();
            if (!walletAddress) {
              toast({
                title: 'خطأ',
                description: 'يجب ربط المحفظة أولاً لإتمام هذه المهمة',
                variant: 'destructive'
              });
              return;
            }
          }

          // Show payment confirmation
          const confirmed = window.confirm('هذه المهمة تتطلب دفع 0.1 تون. هل تريد المتابعة؟');
          if (!confirmed) {
            return;
          }

          // Here you would integrate with TON payment
          // For now, we'll simulate the payment
          toast({
            title: 'جاري المعالجة',
            description: 'جاري معالجة الدفع...',
          });

          // Simulate payment processing
          await new Promise(resolve => setTimeout(resolve, 3000));
          
        } catch (error) {
          toast({
            title: 'خطأ في الدفع',
            description: 'فشل في معالجة الدفع',
            variant: 'destructive'
          });
          return;
        }
      } else {
        // Open URL if exists for other tasks
        if (task.external_link) {
          window.open(task.external_link, '_blank');
        }
      }

      // Simulate task completion delay
      setTimeout(async () => {
        try {
          await completeTask(task.id);
          
          toast({
            title: getTranslation('taskCompleted'),
            description: `${getTranslation('earnedReward')} ${task.reward_amount} $SPACE!`,
          });
        } catch (error) {
          console.error('Error completing task:', error);
          toast({
            title: 'خطأ',
            description: 'فشل في إتمام المهمة',
            variant: 'destructive'
          });
        } finally {
          setIsTaskInProgress(prev => ({ ...prev, [task.id]: false }));
        }
      }, 2000);
    } catch (error) {
      console.error('Error handling task completion:', error);
      setIsTaskInProgress(prev => ({ ...prev, [task.id]: false }));
    }
  };

  const isTaskCompleted = (taskId: string) => {
    return completedTasks.some(ct => ct.task_id === taskId);
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => {
      if (category === 'main') return task.status === 'pending' || task.status === 'in_progress';
      if (category === 'partner') return task.status === 'completed';
      if (category === 'daily') return task.status === 'pending';
      return false;
    }).filter(task => task.is_active);
  };

  const renderTaskCard = (task: Task) => {
    const TaskIcon = getTaskIcon(task.status || 'pending');
    const isCompleted = isTaskCompleted(task.id);
    const inProgress = isTaskInProgress[task.id];
    const category = task.status === 'completed' ? 'partner' : 
                    task.status === 'pending' ? 'daily' : 'main';
    
    return (
      <Card 
        key={task.id} 
        className="bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-xl border border-blue-400/20 rounded-xl cursor-pointer hover:border-blue-300/40 transition-all duration-200"
        onClick={() => handleTaskClick(task)}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {/* Task Image or Icon */}
            <div className={`flex-shrink-0 ${task.image_url ? 'w-12 h-12 rounded-full overflow-hidden' : `p-2 rounded-full bg-gradient-to-r ${getCategoryColor(task.status || 'pending')}`}`}>
              {task.image_url ? (
                <img 
                  src={task.image_url} 
                  alt={task.title || 'Task image'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <TaskIcon className="w-4 h-4 text-white" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm truncate mb-2">
                {task.title}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <img 
                    src="/lovable-uploads/be8f1a36-1907-4464-9c19-754c1d78354a.png" 
                    alt="Space Coin"
                    className="w-3 h-3 rounded-full"
                  />
                  <span className="text-yellow-400 font-bold text-xs">
                    +{formatReward(task.reward_amount || 0)}
                  </span>
                  {task.title === 'daily check-in' && (
                    <span className="text-orange-400 text-xs ml-1">(0.1 TON)</span>
                  )}
                </div>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskComplete(task);
                  }}
                  disabled={isCompleted || inProgress}
                  size="sm"
                  className={`text-xs py-1 px-2 h-7 ${
                    isCompleted 
                      ? 'bg-green-600 cursor-not-allowed' 
                      : inProgress
                        ? 'bg-yellow-600 cursor-not-allowed'
                        : `bg-gradient-to-r ${getCategoryColor(task.status || 'pending')} hover:opacity-90`
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : inProgress ? (
                    <Clock className="w-3 h-3 animate-spin" />
                  ) : (
                    task.external_link ? <ExternalLink className="w-3 h-3" /> : <Gift className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (tasksLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

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
            {getTranslation('tasks')}
          </h1>
          <p className="text-gray-300 text-sm">
            {getTranslation('completeTasksEarn')}
          </p>
        </div>

        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-blue-400/30 mb-4">
            <TabsTrigger 
              value="main" 
              className="text-xs data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <UserPlus className="w-3 h-3 mr-1" />
              {getTranslation('mainTasks')}
            </TabsTrigger>
            <TabsTrigger 
              value="partner" 
              className="text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
            >
              <Handshake className="w-3 h-3 mr-1" />
              {getTranslation('partnerTasks')}
            </TabsTrigger>
            <TabsTrigger 
              value="daily" 
              className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
            >
              <Calendar className="w-3 h-3 mr-1" />
              {getTranslation('dailyTasks')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="space-y-3">
            {getTasksByCategory('main').map((task, index) => (
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
            {getTasksByCategory('partner').map((task, index) => (
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
            {getTasksByCategory('daily').map((task, index) => (
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
