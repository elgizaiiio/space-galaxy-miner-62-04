
import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { taskUserService } from '@/services/taskUserService';
import type { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserGameData = Database['public']['Tables']['user_game_data']['Row'];
type TaskCompletion = Database['public']['Tables']['user_task_completions']['Row'];

export const useUserData = (telegramUserId?: number) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [gameData, setGameData] = useState<UserGameData | null>(null);
  const [completedTasks, setCompletedTasks] = useState<TaskCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (telegramUserId) {
      loadUserData();
    }
  }, [telegramUserId]);

  const loadUserData = async () => {
    if (!telegramUserId) return;
    
    setIsLoading(true);
    try {
      // Get user profile
      const profile = await userService.getUserProfile(telegramUserId);
      setUserProfile(profile);
      
      if (profile) {
        // Get game data
        const gameInfo = await userService.getUserGameData(profile.id);
        setGameData(gameInfo);
        
        // Get completed tasks - using a dummy address for now
        const tasks = await taskUserService.getUserCompletedTasks(profile.id);
        setCompletedTasks(tasks);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = async (amount: number) => {
    if (!userProfile) return;
    
    try {
      const updatedGameData = await userService.updateUserBalance(userProfile.id, amount);
      setGameData(updatedGameData);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const addMiningReward = async (reward: number) => {
    if (!userProfile) return;
    
    try {
      const updatedGameData = await userService.addMiningReward(userProfile.id, reward);
      setGameData(updatedGameData);
    } catch (error) {
      console.error('Error adding mining reward:', error);
    }
  };

  const completeTask = async (taskId: string) => {
    if (!userProfile) return;
    
    try {
      const completion = await taskUserService.completeTask(taskId, userProfile.id);
      setCompletedTasks(prev => [...prev, completion]);
      return completion;
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return {
    userProfile,
    gameData,
    completedTasks,
    isLoading,
    updateBalance,
    addMiningReward,
    completeTask,
    reloadData: loadUserData
  };
};
