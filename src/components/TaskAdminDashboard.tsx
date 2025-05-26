
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, CheckSquare, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { taskService } from '@/services/taskService';
import TaskAdminTable from './TaskAdminTable';
import TaskFormSimple from './TaskFormSimple';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];
type NewTask = Database['public']['Tables']['tasks']['Insert'];

const TaskAdminDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      console.log('Loading tasks...');
      const data = await taskService.getAllTasks();
      console.log('Loaded tasks:', data);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل المهام',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (taskData: NewTask) => {
    console.log('Creating new task:', taskData);
    setIsLoading(true);
    
    try {
      await taskService.createTask(taskData);
      toast({
        title: 'نجح',
        description: 'تم إنشاء المهمة بنجاح',
      });
      setShowForm(false);
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في إنشاء المهمة',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: NewTask) => {
    if (!editingTask) return;
    
    console.log('Updating task:', editingTask.id, taskData);
    setIsLoading(true);
    
    try {
      await taskService.updateTask(editingTask.id, taskData);
      toast({
        title: 'نجح',
        description: 'تم تحديث المهمة بنجاح',
      });
      setShowForm(false);
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث المهمة',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (task: Task) => {
    console.log('Editing task:', task);
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
      try {
        await taskService.deleteTask(id);
        toast({
          title: 'نجح',
          description: 'تم حذف المهمة بنجاح'
        });
        await loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        toast({
          title: 'خطأ',
          description: 'فشل في حذف المهمة',
          variant: 'destructive'
        });
      }
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await taskService.toggleTaskStatus(id, isActive);
      toast({
        title: 'نجح',
        description: `تم ${isActive ? 'تفعيل' : 'إلغاء تفعيل'} المهمة بنجاح`
      });
      await loadTasks();
    } catch (error) {
      console.error('Error toggling task status:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث حالة المهمة',
        variant: 'destructive'
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-2xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            لوحة إدارة المهام
          </h1>
          <p className="text-gray-300">
            إدارة المهام والمكافآت للمستخدمين
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-500/15 to-cyan-500/15 backdrop-blur-xl border-2 border-blue-500/40 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">إجمالي المهام</p>
                  <p className="text-white text-2xl font-bold">{tasks.length}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border-2 border-green-500/40 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">المهام النشطة</p>
                  <p className="text-white text-2xl font-bold">{tasks.filter(t => t.is_active).length}</p>
                </div>
                <CheckSquare className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/15 to-pink-500/15 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">المهام غير النشطة</p>
                  <p className="text-white text-2xl font-bold">{tasks.filter(t => !t.is_active).length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">إدارة المهام</h2>
          {!showForm && (
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة مهمة جديدة
            </Button>
          )}
        </div>

        {/* Task Form */}
        {showForm && (
          <TaskFormSimple
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}

        {/* Tasks Table */}
        {!showForm && (
          <TaskAdminTable 
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default TaskAdminDashboard;
