
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Users, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { taskService } from '@/services/taskService';
import TaskAdminTable from './TaskAdminTable';
import TaskForm from './TaskForm';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];
type NewTask = Database['public']['Tables']['tasks']['Insert'];

const TaskAdminDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalRewards: 0
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const total = tasks.length;
    const active = tasks.filter(task => task.is_active).length;
    const totalRewards = tasks.reduce((sum, task) => sum + task.reward_amount, 0);
    
    setStats({ total, active, totalRewards });
  };

  const handleCreateTask = async (taskData: NewTask) => {
    try {
      await taskService.createTask(taskData);
      await loadTasks();
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskData: NewTask) => {
    if (!editingTask) return;
    
    try {
      await taskService.updateTask(editingTask.id, taskData);
      await loadTasks();
      setEditingTask(null);
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.deleteTask(id);
      await loadTasks();
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await taskService.toggleTaskStatus(id, isActive);
      await loadTasks();
      toast({
        title: "Success",
        description: `Task ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingTask(null);
  };

  const isFormVisible = isCreating || editingTask;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Task Administration
          </h1>
          <p className="text-gray-300">Manage tasks for users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500/15 to-cyan-500/15 backdrop-blur-xl border-2 border-blue-500/40 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">Total Tasks</p>
                  <p className="text-white text-2xl font-bold">{stats.total}</p>
                </div>
                <Trophy className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/15 to-emerald-500/15 backdrop-blur-xl border-2 border-green-500/40 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm">Active Tasks</p>
                  <p className="text-white text-2xl font-bold">{stats.active}</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/15 to-pink-500/15 backdrop-blur-xl border-2 border-purple-500/40 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Total Rewards</p>
                  <p className="text-white text-2xl font-bold">{stats.totalRewards} $SPACE</p>
                </div>
                <Trophy className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Task Button */}
        {!isFormVisible && (
          <div className="flex justify-center mb-6">
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          </div>
        )}

        {/* Task Form */}
        {isFormVisible && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCancel}
          />
        )}

        {/* Tasks Table */}
        {!isFormVisible && (
          <TaskAdminTable
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default TaskAdminDashboard;
