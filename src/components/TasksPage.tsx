
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Gift, TrendingUp, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: 'daily' | 'weekly' | 'special';
  icon: React.ReactNode;
}

const TasksPage = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'تسجيل الدخول اليومي',
      description: 'سجل دخولك يومياً للحصول على مكافأة',
      reward: 100,
      completed: false,
      type: 'daily',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: '2',
      title: 'جمع 1000 $SPACE',
      description: 'اجمع 1000 عملة $SPACE من التعدين',
      reward: 500,
      completed: false,
      type: 'daily',
      icon: <Star className="w-4 h-4" />
    },
    {
      id: '3',
      title: 'ادع 5 أصدقاء',
      description: 'ادع 5 أصدقاء جدد للانضمام للتطبيق',
      reward: 2000,
      completed: false,
      type: 'weekly',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: '4',
      title: 'ترقية التعدين',
      description: 'قم بترقية سرعة التعدين مرة واحدة',
      reward: 1000,
      completed: false,
      type: 'special',
      icon: <TrendingUp className="w-4 h-4" />
    }
  ]);

  const handleCompleteTask = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      )
    );
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: "مهمة مكتملة!",
        description: `تم حصولك على ${task.reward} $SPACE`,
      });
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'border-blue-500 bg-blue-500/10';
      case 'weekly': return 'border-purple-500 bg-purple-500/10';
      case 'special': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return 'يومية';
      case 'weekly': return 'أسبوعية';
      case 'special': return 'خاصة';
      default: return '';
    }
  };

  const completedTasks = tasks.filter(t => t.completed);
  const totalRewards = completedTasks.reduce((sum, t) => sum + t.reward, 0);
  const progressPercentage = Math.round((completedTasks.length / tasks.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-dark via-blue-900 to-purple-900 p-3 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent mb-2">
            المهام
          </h1>
          <p className="text-gray-300 text-sm">أكمل المهام واحصل على مكافآت $SPACE</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <Card className="glass-card">
            <CardContent className="p-3 text-center">
              <Gift className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <h3 className="text-xs font-semibold text-white mb-1">إجمالي المكافآت</h3>
              <p className="text-sm font-bold text-yellow-400">
                {totalRewards} $SPACE
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-3 text-center">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <h3 className="text-xs font-semibold text-white mb-1">المهام المكتملة</h3>
              <p className="text-sm font-bold text-green-400">
                {completedTasks.length} / {tasks.length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-3 text-center">
              <Star className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <h3 className="text-xs font-semibold text-white mb-1">التقدم</h3>
              <p className="text-sm font-bold text-purple-400">
                {progressPercentage}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className={`glass-card border-2 ${getTaskTypeColor(task.type)} ${task.completed ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-1">
                      {task.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-white text-base leading-tight">{task.title}</CardTitle>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white inline-block mt-1">
                        {getTaskTypeLabel(task.type)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-yellow-400 font-bold text-sm">+{task.reward}</p>
                    <p className="text-yellow-400 text-xs">$SPACE</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">{task.description}</p>
                <Button
                  onClick={() => handleCompleteTask(task.id)}
                  disabled={task.completed}
                  className={`w-full h-12 text-sm font-medium ${
                    task.completed
                      ? 'bg-green-600 hover:bg-green-600'
                      : 'space-button'
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
