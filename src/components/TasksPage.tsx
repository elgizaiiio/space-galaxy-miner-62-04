import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Trophy, ExternalLink, Clock } from 'lucide-react';
import { getTranslation } from '../utils/language';
import { taskService } from '@/services/taskService';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskWithImage extends Task {
  image_url?: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<TaskWithImage[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [claimedTasks, setClaimedTasks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Daily tasks data - properly structured to match Task interface
  const dailyTasks: TaskWithImage[] = [
    {
      id: 'daily-checkin',
      title_key: 'Daily Check-in',
      description_key: 'Check in daily to earn rewards',
      task_type: 'daily',
      reward_amount: 0.1,
      action_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop&crop=center',
      category: null,
      completed: false,
      description: 'Check in daily to earn rewards',
      link: null,
      reward_type: null,
      title: 'Daily Check-in'
    },
    {
      id: 'daily-share-x',
      title_key: 'Share on X (Twitter)',
      description_key: 'Share our mining bot on X to earn rewards',
      task_type: 'daily',
      reward_amount: 50,
      action_url: 'https://twitter.com/intent/tweet?text=Check%20out%20this%20amazing%20mining%20bot!&url=http://t.me/botspacelbot/Mining',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop&crop=center',
      category: null,
      completed: false,
      description: 'Share our mining bot on X to earn rewards',
      link: 'https://twitter.com/intent/tweet?text=Check%20out%20this%20amazing%20mining%20bot!&url=http://t.me/botspacelbot/Mining',
      reward_type: null,
      title: 'Share on X (Twitter)'
    }
  ];

  useEffect(() => {
    loadTasks();
    loadCompletedTasks();
    loadClaimedTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      const activeTasks = data.filter(task => task.is_active).map(task => ({
        ...task,
        image_url: getTaskImage(task.task_type)
      }));
      setTasks(activeTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskImage = (taskType: string) => {
    switch (taskType) {
      case 'mining':
        return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=center';
      case 'social':
        return 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop&crop=center';
      case 'wallet':
        return 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop&crop=center';
      default:
        return 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop&crop=center';
    }
  };

  const loadCompletedTasks = () => {
    const completed = localStorage.getItem('completed-tasks');
    if (completed) {
      setCompletedTasks(JSON.parse(completed));
    }
  };

  const loadClaimedTasks = () => {
    const claimed = localStorage.getItem('claimed-tasks');
    if (claimed) {
      setClaimedTasks(JSON.parse(claimed));
    }
  };

  const handleTaskGo = (taskId: string, actionUrl?: string) => {
    if (actionUrl) {
      window.open(actionUrl, '_blank');
    }
    const newCompleted = [...completedTasks, taskId];
    setCompletedTasks(newCompleted);
    localStorage.setItem('completed-tasks', JSON.stringify(newCompleted));
  };

  const handleTaskClaim = (taskId: string, rewardAmount: number, rewardType: string = '$SPACE') => {
    const newClaimed = [...claimedTasks, taskId];
    setClaimedTasks(newClaimed);
    localStorage.setItem('claimed-tasks', JSON.stringify(newClaimed));
    
    toast({
      title: "Reward Claimed!",
      description: `You've earned ${rewardAmount} ${rewardType}!`
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-500/20 text-blue-300';
      case 'social':
        return 'bg-purple-500/20 text-purple-300';
      case 'mining':
        return 'bg-orange-500/20 text-orange-300';
      case 'wallet':
        return 'bg-pink-500/20 text-pink-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  // Filter tasks by type
  const mainTasks = tasks.filter(task => task.task_type === 'mining' || task.task_type === 'wallet');
  const partnerTasks = tasks.filter(task => task.task_type === 'social');
  const allDailyTasks = dailyTasks;

  const renderTasks = (taskList: TaskWithImage[]) => {
    if (isLoading && taskList !== allDailyTasks) {
      return (
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-xl">
          <CardContent className="p-4 text-center">
            <p className="text-gray-300 text-sm">Loading tasks...</p>
          </CardContent>
        </Card>
      );
    }

    // Filter out claimed tasks
    const visibleTasks = taskList.filter(task => !claimedTasks.includes(task.id));

    if (visibleTasks.length === 0) {
      return (
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="space-y-2">
              <Trophy className="w-6 h-6 text-indigo-400 mx-auto" />
              <h3 className="text-white text-base font-bold">No Tasks Available</h3>
              <p className="text-gray-300 text-xs">All tasks completed!</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {visibleTasks.map(task => {
          const isCompleted = completedTasks.includes(task.id);
          const isClaimed = claimedTasks.includes(task.id);
          
          if (isClaimed) return null;

          return (
            <Card key={task.id} className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Circular Image */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    {task.image_url ? (
                      <img 
                        src={task.image_url} 
                        alt={task.title_key}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Trophy className="w-6 h-6 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-sm font-bold truncate">
                      {task.title_key}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${getTypeColor(task.task_type)} text-xs px-2 py-0.5`}>
                        {task.task_type}
                      </Badge>
                      <span className="text-zinc-50 text-xs font-bold">
                        +{task.reward_amount} {task.task_type === 'daily' && task.title_key === 'Daily Check-in' ? 'TON' : '$SPACE'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {!isCompleted ? (
                      <Button 
                        onClick={() => handleTaskGo(task.id, task.action_url || undefined)} 
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs rounded-full px-4 py-2 h-auto"
                      >
                        {task.action_url && <ExternalLink className="w-3 h-3 mr-1" />}
                        Go
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleTaskClaim(
                          task.id, 
                          task.reward_amount, 
                          task.task_type === 'daily' && task.title_key === 'Daily Check-in' ? 'TON' : '$SPACE'
                        )} 
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-xs rounded-full px-4 py-2 h-auto"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Claim
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-md mx-auto space-y-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
            Tasks
          </h1>
          <p className="text-gray-300 text-sm">
            Complete tasks to earn rewards
          </p>
        </div>

        {/* Stats Card */}
        <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border border-green-500/40 rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-50 font-bold">Tasks Completed</p>
                <p className="text-white text-lg font-bold">
                  {claimedTasks.length}/{tasks.length + dailyTasks.length}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        {/* Tasks Tabs */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl border border-gray-600/30 rounded-xl">
            <TabsTrigger 
              value="daily" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 text-sm transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/50 hover:to-purple-600/50"
            >
              <Clock className="w-4 h-4 mr-1" />
              Daily
            </TabsTrigger>
            <TabsTrigger 
              value="main" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white text-gray-300 text-sm transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/50 hover:to-red-600/50"
            >
              Main
            </TabsTrigger>
            <TabsTrigger 
              value="partners" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white text-gray-300 text-sm transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/50 hover:to-pink-600/50"
            >
              Partners
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="mt-4">
            {renderTasks(allDailyTasks)}
          </TabsContent>
          
          <TabsContent value="main" className="mt-4">
            {renderTasks(mainTasks)}
          </TabsContent>
          
          <TabsContent value="partners" className="mt-4">
            {renderTasks(partnerTasks)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TasksPage;
