
import { useState, useEffect } from 'react';
import { taskService } from '@/services/taskService';
import { taskUserService } from '@/services/taskUserService';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];
type NewTask = Database['public']['Tables']['tasks']['Insert'];

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
    initializeDailyCheckIn();
  }, []);

  const initializeDailyCheckIn = async () => {
    try {
      await taskService.createDailyCheckInTask();
    } catch (error) {
      console.error('Error initializing daily check-in task:', error);
    }
  };

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await taskService.getAllTasks();
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

  const createTask = async (taskData: NewTask) => {
    setIsLoading(true);
    try {
      await taskService.createTask(taskData);
      toast({
        title: 'نجح',
        description: 'تم إنشاء المهمة بنجاح'
      });
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

  const updateTask = async (id: string, updates: Partial<Task>) => {
    setIsLoading(true);
    try {
      await taskService.updateTask(id, updates);
      toast({
        title: 'نجح',
        description: 'تم تحديث المهمة بنجاح'
      });
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

  const deleteTask = async (id: string) => {
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
  };

  const toggleTaskStatus = async (id: string, isActive: boolean) => {
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

  const checkTaskCompletion = async (taskId: string, userAddress: string) => {
    try {
      return await taskUserService.isTaskCompleted(taskId, userAddress);
    } catch (error) {
      console.error('Error checking task completion:', error);
      return false;
    }
  };

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    checkTaskCompletion,
    reloadTasks: loadTasks
  };
};
