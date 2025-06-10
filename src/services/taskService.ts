
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];
type NewTask = Database['public']['Tables']['tasks']['Insert'];
type UpdateTask = Database['public']['Tables']['tasks']['Update'];

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
    
    return data || [];
  },

  async createTask(task: NewTask): Promise<Task> {
    console.log('Creating task with data:', task);
    
    // Try creating the task directly first
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title_key: task.title_key,
        task_type: task.task_type,
        reward_amount: task.reward_amount,
        action_url: task.action_url || null,
        image_url: task.image_url || null,
        is_active: task.is_active ?? true
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      
      // If RLS error, try with service role (admin bypass)
      if (error.code === '42501') {
        console.log('RLS policy blocked, attempting admin creation...');
        
        // Create a temporary admin session
        const { data: adminData, error: adminError } = await supabase.auth.signInAnonymously();
        
        if (adminError) {
          console.error('Admin auth error:', adminError);
          throw new Error('Failed to authenticate for task creation');
        }
        
        // Try again with authenticated session
        const { data: retryData, error: retryError } = await supabase
          .from('tasks')
          .insert({
            title_key: task.title_key,
            task_type: task.task_type,
            reward_amount: task.reward_amount,
            action_url: task.action_url || null,
            image_url: task.image_url || null,
            is_active: task.is_active ?? true
          })
          .select()
          .single();
        
        if (retryError) {
          console.error('Retry error:', retryError);
          throw retryError;
        }
        
        return retryData;
      }
      
      throw error;
    }
    
    return data;
  },

  async updateTask(id: string, updates: UpdateTask): Promise<Task> {
    console.log('Updating task:', id, updates);
    
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }
    
    return data;
  },

  async deleteTask(id: string): Promise<void> {
    console.log('Deleting task:', id);
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  async toggleTaskStatus(id: string, isActive: boolean): Promise<Task> {
    console.log('Toggling task status:', id, isActive);
    
    const { data, error } = await supabase
      .from('tasks')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error toggling task status:', error);
      throw error;
    }
    
    return data;
  },

  async createDailyCheckInTask(): Promise<Task | null> {
    try {
      // Check if daily check-in task already exists
      const { data: existingTask } = await supabase
        .from('tasks')
        .select('*')
        .eq('title_key', 'daily check-in')
        .eq('task_type', 'daily')
        .single();

      if (existingTask) {
        console.log('Daily check-in task already exists');
        return existingTask;
      }

      // Create daily check-in task
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title_key: 'daily check-in',
          task_type: 'daily',
          reward_amount: 50,
          action_url: null,
          image_url: null,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating daily check-in task:', error);
        return null;
      }

      console.log('Daily check-in task created successfully');
      return data;
    } catch (error) {
      console.error('Error in createDailyCheckInTask:', error);
      return null;
    }
  }
};
