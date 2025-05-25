
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type User = Database['public']['Tables']['users']['Row'];
type MiningSession = Database['public']['Tables']['mining_sessions']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type UserTask = Database['public']['Tables']['user_tasks']['Row'];

export const supabaseService = {
  // User methods
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  },

  async updateUserBalance(userId: string, amount: number) {
    const { data, error } = await supabase
      .from('users')
      .update({ bolt_balance: amount })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mining methods
  async startMiningSession(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase.rpc('start_mining_session', {
      user_uuid: user.id
    });

    if (error) throw error;
    return data;
  },

  async claimMiningRewards(sessionId: string): Promise<number> {
    const { data, error } = await supabase.rpc('claim_mining_rewards', {
      session_uuid: sessionId
    });

    if (error) throw error;
    return data;
  },

  async getActiveMiningSession(): Promise<MiningSession | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('mining_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('start_time', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching mining session:', error);
      return null;
    }

    return data;
  },

  // Tasks methods
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  },

  async getUserTasks(): Promise<UserTask[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  },

  async completeTask(taskId: string): Promise<UserTask> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_tasks')
      .insert({
        user_id: user.id,
        task_id: taskId,
        is_verified: true
      })
      .select()
      .single();

    if (error) throw error;

    // Add reward to user balance
    const task = await this.getTaskById(taskId);
    if (task) {
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        await this.updateUserBalance(
          user.id,
          (currentUser.bolt_balance || 0) + task.reward_amount
        );
      }
    }

    return data;
  },

  async getTaskById(taskId: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) return null;
    return data;
  },

  // Referrals methods
  async getUserReferrals() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id);

    if (error) throw error;
    return data || [];
  },

  async createReferral(referredUserId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('referrals')
      .insert({
        referrer_id: user.id,
        referred_user_id: referredUserId,
        reward_amount: 1000
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
