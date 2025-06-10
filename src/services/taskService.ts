
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];
type NewTask = Database['public']['Tables']['tasks']['Insert'];
type UpdateTask = Database['public']['Tables']['tasks']['Update'];

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tasks:', error);
        throw new Error(`Failed to fetch tasks: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAllTasks:', error);
      throw error instanceof Error ? error : new Error('Unknown error fetching tasks');
    }
  },

  async createTask(task: NewTask): Promise<Task> {
    try {
      console.log('Creating task with data:', task);
      
      // Validate required fields
      if (!task.title_key || !task.task_type || task.reward_amount === undefined) {
        throw new Error('Missing required task fields');
      }

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
        
        // Handle specific error cases
        if (error.code === '42501') {
          throw new Error('Permission denied. Please check your access rights.');
        }
        
        if (error.code === '23505') {
          throw new Error('A task with this title already exists.');
        }
        
        throw new Error(`Failed to create task: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned from task creation');
      }
      
      return data;
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error instanceof Error ? error : new Error('Unknown error creating task');
    }
  },

  async updateTask(id: string, updates: UpdateTask): Promise<Task> {
    try {
      console.log('Updating task:', id, updates);
      
      if (!id) {
        throw new Error('Task ID is required');
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating task:', error);
        throw new Error(`Failed to update task: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Task not found or update failed');
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error instanceof Error ? error : new Error('Unknown error updating task');
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      console.log('Deleting task:', id);
      
      if (!id) {
        throw new Error('Task ID is required');
      }
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting task:', error);
        throw new Error(`Failed to delete task: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error instanceof Error ? error : new Error('Unknown error deleting task');
    }
  },

  async toggleTaskStatus(id: string, isActive: boolean): Promise<Task> {
    try {
      console.log('Toggling task status:', id, isActive);
      
      if (!id) {
        throw new Error('Task ID is required');
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error toggling task status:', error);
        throw new Error(`Failed to update task status: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Task not found or status update failed');
      }
      
      return data;
    } catch (error) {
      console.error('Error in toggleTaskStatus:', error);
      throw error instanceof Error ? error : new Error('Unknown error updating task status');
    }
  },

  async createDailyCheckInTask(): Promise<Task | null> {
    try {
      // Check if daily check-in task already exists
      const { data: existingTask, error: checkError } = await supabase
        .from('tasks')
        .select('*')
        .eq('title_key', 'daily check-in')
        .eq('task_type', 'daily')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 means no rows found, which is expected
        console.error('Error checking for existing daily task:', checkError);
        return null;
      }

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
