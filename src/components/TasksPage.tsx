import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { useTaskManagement } from '@/hooks/useTaskManagement';
import { useUserData } from '@/hooks/useUserData';
import { useSpaceCoins } from '../hooks/useSpaceCoins';
import { tonService } from '@/services/tonService';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { TON_PAYMENT_ADDRESS } from '@/utils/ton';
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

const COMPLETED_TASKS_KEY = 'completedTasks';

const TasksPage = () => {
  const [isTaskInProgress, setIsTaskInProgress] = useState<Record<string, boolean>>({});
  const [permanentlyCompletedTasks, setPermanentlyCompletedTasks] = useState<Set<string>>(new Set());
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();
  const { addCoins } = useSpaceCoins();
  
  // Get real tasks from database
  const { tasks, isLoading: tasksLoading, checkTaskCompletion } = useTaskManagement();
  
  // Mock user data - in real app this would come from authentication
  const mockTelegramUserId = "123456789";
  const { userProfile, completedTasks, completeTask, isLoading: userLoading } = useUserData(mockTelegramUserId);

  // Load permanently completed tasks from localStorage on component mount
  useEffect(() => {
    const savedCompletedTasks = localStorage.getItem(COMPLETED_TASKS_KEY);
    if (savedCompletedTasks) {
      try {
        const parsedTasks = JSON.parse(savedCompletedTasks);
        if (Array.isArray(parsedTasks)) {
          setPermanentlyCompletedTasks(new Set(parsedTasks));
          console.log('Loaded completed tasks from localStorage:', parsedTasks);
        }
      } catch (error) {
        console.error('Error parsing saved completed tasks:', error);
        localStorage.removeItem(COMPLETED_TASKS_KEY);
      }
    }
  }, []);

  // Save completed tasks to localStorage whenever the set changes
  const saveCompletedTasksToStorage = (completedSet: Set<string>) => {
    try {
      const tasksArray = Array.from(completedSet);
      localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(tasksArray));
      console.log('Saved completed tasks to localStorage:', tasksArray);
    } catch (error) {
      console.error('Error saving completed tasks to localStorage:', error);
    }
  };

  // Update permanently completed tasks when completedTasks changes
  useEffect(() => {
    if (completedTasks.length > 0) {
      const completedTaskIds = completedTasks.map(ct => ct.task_id);
      const newPermanentlyCompleted = new Set([...permanentlyCompletedTasks, ...completedTaskIds]);
      setPermanentlyCompletedTasks(newPermanentlyCompleted);
      saveCompletedTasksToStorage(newPermanentlyCompleted);
    }
  }, [completedTasks]);

  const markTaskAsCompleted = (taskId: string) => {
    const newCompletedTasks = new Set([...permanentlyCompletedTasks, taskId]);
    setPermanentlyCompletedTasks(newCompletedTasks);
    saveCompletedTasksToStorage(newCompletedTasks);
    console.log('Task marked as completed:', taskId);
  };

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
    console.log('Task clicked:', task.title, task);
    handleTaskComplete(task);
  };

  const handleDailyCheckInPayment = async () => {
    try {
      console.log('Starting daily check-in payment process');
      
      // Check if wallet is connected
      if (!tonConnectUI.wallet) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet first to complete this task',
          variant: 'destructive'
        });
        await tonConnectUI.openModal();
        return false;
      }

      toast({
        title: 'Processing',
        description: 'Processing payment...',
      });

      // Create payment transaction without payload (comment)
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
        messages: [
          {
            address: TON_PAYMENT_ADDRESS,
            amount: (0.1 * 1e9).toString(), // Convert 0.1 TON to nanoTON
          },
        ],
      };

      // Send transaction using TON Connect UI
      const result = await tonConnectUI.sendTransaction(transaction);
      
      console.log('Payment transaction result:', result);
      
      toast({
        title: 'Payment Successful',
        description: '0.1 TON sent successfully',
      });

      return true;
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: 'Payment Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const handleTaskComplete = async (task: Task) => {
    console.log('handleTaskComplete called for task:', task.title, task.id);
    
    // Check if task is already in progress
    if (isTaskInProgress[task.id] === true) {
      console.log('Task already in progress');
      return;
    }

    // Check if task is permanently completed
    if (permanentlyCompletedTasks.has(task.id)) {
      console.log('Task already permanently completed');
      toast({
        title: getTranslation('taskCompleted'),
        description: 'This task is already completed',
        variant: 'destructive'
      });
      return;
    }

    console.log('Setting task in progress:', task.id);
    setIsTaskInProgress(prev => ({ ...prev, [task.id]: true }));

    try {
      // Handle daily check-in task (requires TON payment)
      if (task.title === 'daily check-in' && task.status === 'pending') {
        console.log('Processing daily check-in payment');
        const paymentSuccess = await handleDailyCheckInPayment();
        if (!paymentSuccess) {
          console.log('Payment failed, resetting task progress');
          setIsTaskInProgress(prev => ({ ...prev, [task.id]: false }));
          return;
        }
        console.log('Payment successful, proceeding with task completion');
      } else if (task.external_link && task.external_link !== '#') {
        console.log('Opening external link:', task.external_link);
        window.open(task.external_link, '_blank');
      }

      // Simulate task completion delay
      console.log('Starting task completion delay');
      setTimeout(async () => {
        try {
          console.log('Completing task in database');
          await completeTask(task.id);
          
          // Mark task as completed immediately
          markTaskAsCompleted(task.id);
          
          // Add coins to the shared service
          addCoins(task.reward_amount || 0);
          
          toast({
            title: getTranslation('taskCompleted'),
            description: `${getTranslation('earnedReward')} ${task.reward_amount} $SPACE!`,
          });
          console.log('Task completed successfully');
        } catch (error) {
          console.error('Error completing task:', error);
          toast({
            title: 'Error',
            description: 'Failed to complete task',
            variant: 'destructive'
          });
        } finally {
          console.log('Resetting task progress');
          setIsTaskInProgress(prev => ({ ...prev, [task.id]: false }));
        }
      }, 2000);
    } catch (error) {
      console.error('Error handling task completion:', error);
      setIsTaskInProgress(prev => ({ ...prev, [task.id]: false }));
    }
  };

  const isTaskCompleted = (taskId: string) => {
    return permanentlyCompletedTasks.has(taskId);
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => {
      // Always hide permanently completed tasks
      const isCompleted = isTaskCompleted(task.id);
      if (isCompleted) {
        console.log('Hiding permanently completed task:', task.title, task.id);
        return false;
      }

      // Only show active tasks
      if (!task.is_active) {
        return false;
      }

      // Filter by category for non-completed tasks only
      if (category === 'main') return task.status === 'pending' || task.status === 'in_progress';
      if (category === 'partner') return task.status === 'completed';
      if (category === 'daily') return task.status === 'pending' && task.title === 'daily check-in';
      return false;
    });
  };

  const renderTaskCard = (task: Task) => {
    const TaskIcon = getTaskIcon(task.status || 'pending');
    const isCompleted = isTaskCompleted(task.id);
    const inProgress = isTaskInProgress[task.id] === true;
    
    // Don't render permanently completed tasks at all
    if (isCompleted) {
      return null;
    }
    
    console.log('Rendering task card:', task.title, 'isCompleted:', isCompleted, 'inProgress:', inProgress);
    
    return (
      <Card 
        key={task.id} 
        className="bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-xl border border-blue-400/20 rounded-xl cursor-pointer hover:border-blue-300/40 transition-all duration-200"
        onClick={() => {
          console.log('Card clicked for task:', task.title);
          handleTaskClick(task);
        }}
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
                    console.log('Button clicked for task:', task.title);
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
                    task.external_link && task.external_link !== '#' ? <ExternalLink className="w-3 h-3" /> : <Gift className="w-3 h-3" />
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
        <div className="text-white">Loading...</div>
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
            {getTasksByCategory('main').map((task, index) => {
              const taskCard = renderTaskCard(task);
              if (!taskCard) return null;
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {taskCard}
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="partner" className="space-y-3">
            {getTasksByCategory('partner').map((task, index) => {
              const taskCard = renderTaskCard(task);
              if (!taskCard) return null;
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {taskCard}
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="daily" className="space-y-3">
            {getTasksByCategory('daily').map((task, index) => {
              const taskCard = renderTaskCard(task);
              if (!taskCard) return null;
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {taskCard}
                </motion.div>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TasksPage;
