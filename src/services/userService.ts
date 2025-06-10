
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type NewUserProfile = Database['public']['Tables']['user_profiles']['Insert'];
type UpdateUserProfile = Database['public']['Tables']['user_profiles']['Update'];

type UserGameData = Database['public']['Tables']['user_game_data']['Row'];
type NewUserGameData = Database['public']['Tables']['user_game_data']['Insert'];
type UpdateUserGameData = Database['public']['Tables']['user_game_data']['Update'];

export const userService = {
  // User Profile Management
  async createUserProfile(profile: NewUserProfile): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
    
    return data;
  },

  async getUserProfile(telegramUserId: number): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('telegram_user_id', telegramUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    return data;
  },

  async updateUserProfile(userId: string, updates: UpdateUserProfile): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    
    return data;
  },

  // Game Data Management
  async createUserGameData(gameData: NewUserGameData): Promise<UserGameData> {
    const { data, error } = await supabase
      .from('user_game_data')
      .insert(gameData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user game data:', error);
      throw error;
    }
    
    return data;
  },

  async getUserGameData(userId: string): Promise<UserGameData | null> {
    const { data, error } = await supabase
      .from('user_game_data')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user game data:', error);
      throw error;
    }
    
    return data;
  },

  async updateUserGameData(userId: string, updates: UpdateUserGameData): Promise<UserGameData> {
    const { data, error } = await supabase
      .from('user_game_data')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user game data:', error);
      throw error;
    }
    
    return data;
  },

  async updateUserBalance(userId: string, amount: number): Promise<UserGameData> {
    const { data, error } = await supabase
      .from('user_game_data')
      .update({ 
        total_balance: amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user balance:', error);
      throw error;
    }
    
    return data;
  },

  async addMiningReward(userId: string, reward: number): Promise<UserGameData> {
    // First get current balance
    const gameData = await this.getUserGameData(userId);
    const currentBalance = gameData?.total_balance || 0;
    const newBalance = currentBalance + reward;
    
    return this.updateUserBalance(userId, newBalance);
  },

  async claimMiningReward(userId: string): Promise<UserGameData> {
    const { data, error } = await supabase
      .from('user_game_data')
      .update({ 
        last_mining_claim: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error claiming mining reward:', error);
      throw error;
    }
    
    return data;
  }
};
