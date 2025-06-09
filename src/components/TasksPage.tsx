
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trophy, ExternalLink } from 'lucide-react';
import { getTranslation } from '../utils/language';
import { taskService } from '@/services/taskService';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Get translation function
  const t = (key: string) => getTranslation(key);

  useEffect(() => {
    loadTasks();
    loadCompletedTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await taskService.getAllTasks();
      setTasks(data.filter(task => task.is_active));
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCompletedTasks = () => {
    const completed = localStorage.getItem('completed-tasks');
    if (completed) {
      setCompletedTasks(JSON.parse(completed));
    }
  };

  const handleTaskComplete = (taskId: string, actionUrl?: string) => {
    if (actionUrl) {
      window.open(actionUrl, '_blank');
    }
    const newCompleted = [...completedTasks, taskId];
    setCompletedTasks(newCompleted);
    localStorage.setItem('completed-tasks', JSON.stringify(newCompleted));
    toast({
      title: "Task Completed!",
      description: "You've earned $SPACE tokens!"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-2 pb-16">
      <div className="max-w-md mx-auto space-y-2">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center mb-0.5">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Trophy className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-0.5">
            {t('tasks')}
          </h1>
          <p className="text-gray-300 text-xs">
            {t('completeTasksEarn')}
          </p>
        </div>

        {/* Stats Card */}
        <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border border-green-500/40 rounded-lg">
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-50 font-bold">{t('tasksCompleted')}</p>
                <p className="text-white text-sm font-bold">{completedTasks.length}/{tasks.length}</p>
              </div>
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        {isLoading ? (
          <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-lg">
            <CardContent className="p-3 text-center">
              <p className="text-gray-300 text-xs">Loading tasks...</p>
            </CardContent>
          </Card>
        ) : tasks.length === 0 ? (
          <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-lg">
            <CardContent className="p-3 text-center">
              <div className="space-y-1">
                <Trophy className="w-5 h-5 text-indigo-400 mx-auto" />
                <h3 className="text-white text-sm font-bold">{t('noTasksAvailable')}</h3>
                <p className="text-gray-300 text-xs">{t('noTasksDesc')}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-1.5">
            {tasks.map(task => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <Card key={task.id} className={`bg-gradient-to-br backdrop-blur-xl border rounded-lg ${
                  isCompleted 
                    ? 'from-green-500/10 to-emerald-500/10 border-green-500/30' 
                    : 'from-indigo-500/10 to-purple-500/10 border-indigo-500/30'
                }`}>
                  <CardHeader className="pb-0.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5">
                        {isCompleted ? 
                          <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : 
                          <Trophy className="w-3.5 h-3.5 text-indigo-400" />
                        }
                        <div>
                          <CardTitle className="text-white text-xs">
                            {t(task.title_key) || task.title_key}
                          </CardTitle>
                          <Badge className={`${getTypeColor(task.task_type)} text-xs px-1 py-0`}>
                            {task.task_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-50 text-xs">+{task.reward_amount} $SPACE</span>
                      {!isCompleted ? (
                        <Button 
                          onClick={() => handleTaskComplete(task.id, task.action_url || undefined)} 
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xs rounded-full px-2 py-1 h-auto"
                        >
                          {task.action_url && <ExternalLink className="w-2.5 h-2.5 mr-0.5" />}
                          Complete
                        </Button>
                      ) : (
                        <Badge className="bg-green-500/20 text-green-300 text-xs px-1.5 py-0">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
