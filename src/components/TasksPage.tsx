
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Calendar, Users, TrendingUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];
type UserTask = Database['public']['Tables']['user_tasks']['Row'];

interface TaskWithCompletion extends Task {
  completed: boolean;
}

const TasksPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskWithCompletion[]>([]);
  const [userTasks, setUserTasks] = useState<UserTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const [allTasks, completedTasks] = await Promise.all([
        supabaseService.getTasks(),
        supabaseService.getUserTasks()
      ]);

      setUserTasks(completedTasks);

      const tasksWithCompletion = allTasks.map(task => ({
        ...task,
        completed: completedTasks.some(ut => ut.task_id === task.id && ut.is_verified)
      }));

      setTasks(tasksWithCompletion);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "خطأ في تحميل المهام",
        description: "فشل في تحميل قائمة المهام",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await supabaseService.completeTask(taskId);
      
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        toast({
          title: "مهمة مكتملة!",
          description: `تم حصولك على ${task.reward_amount} $SPACE`,
        });
      }

      // Reload tasks to update completion status
      await loadTasks();
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "خطأ في إكمال المهمة",
        description: "فشل في إكمال المهمة. حاول مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'daily':
        return <Calendar className="w-4 h-4" />;
      case 'telegram':
        return <Users className="w-4 h-4" />;
      case 'twitter':
        return <Star className="w-4 h-4" />;
      case 'referral':
        return <Users className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getTaskTypeColor = (taskType: string) => {
    switch (taskType) {
      case 'daily':
        return 'border-blue-500 bg-blue-500/10';
      case 'telegram':
        return 'border-purple-500 bg-purple-500/10';
      case 'twitter':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'referral':
        return 'border-green-500 bg-green-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalRewards = tasks
    .filter(t => t.completed)
    .reduce((sum, t) => sum + t.reward_amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-3 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-2xl">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent mb-3">
            المهام
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">أكمل المهام واحصل على مكافآت $SPACE</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border-2 border-green-500/40 rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-green-400 text-2xl font-bold">{completedTasksCount}</p>
              <p className="text-green-300 text-sm">مهام مكتملة</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500/15 to-orange-500/15 backdrop-blur-xl border-2 border-yellow-500/40 rounded-2xl">
            <CardContent className="p-4 text-center">
              <p className="text-yellow-400 text-2xl font-bold">{totalRewards}</p>
              <p className="text-yellow-300 text-sm">$SPACE مكتسب</p>
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-4">
          <Button
            onClick={loadTasks}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="bg-purple-500/20 border-purple-500/50 text-purple-200 hover:bg-purple-500/30"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث المهام
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center text-gray-400 py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>جاري تحميل المهام...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>لا توجد مهام متاحة</p>
            </div>
          ) : (
            tasks.map(task => (
              <Card 
                key={task.id} 
                className={`backdrop-blur-xl border-2 ${getTaskTypeColor(task.task_type)} ${
                  task.completed ? 'opacity-60' : ''
                } rounded-2xl overflow-hidden`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-1">
                        {getTaskIcon(task.task_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-base leading-tight">
                          {task.title_key}
                        </CardTitle>
                      </div>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-yellow-400 font-bold text-sm">+{task.reward_amount}</p>
                      <p className="text-yellow-400 text-xs">$SPACE</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {task.description_key}
                  </p>
                  {task.action_url && (
                    <Button
                      onClick={() => window.open(task.action_url!, '_blank')}
                      variant="outline"
                      size="sm"
                      className="w-full mb-3 bg-blue-500/20 border-blue-500/50 text-blue-200 hover:bg-blue-500/30"
                    >
                      افتح الرابط
                    </Button>
                  )}
                  <Button
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={task.completed}
                    className={`w-full h-12 text-sm font-medium ${
                      task.completed 
                        ? 'bg-green-600 hover:bg-green-600' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                    }`}
                  >
                    {task.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        مكتملة
                      </>
                    ) : (
                      'إكمال المهمة'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
