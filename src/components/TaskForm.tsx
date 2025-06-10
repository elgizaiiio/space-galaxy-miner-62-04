
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];
type NewTask = Database['public']['Tables']['tasks']['Insert'];

interface TaskFormData {
  title_key: string;
  reward_amount: number;
  task_type: string;
  action_url?: string;
  is_active: boolean;
}

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: NewTask) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const form = useForm<TaskFormData>({
    defaultValues: {
      title_key: task?.title_key || '',
      reward_amount: task?.reward_amount || 0,
      task_type: task?.task_type || 'daily',
      action_url: task?.action_url || '',
      is_active: task?.is_active ?? true
    }
  });

  const taskTypes = [
    { value: 'daily', label: 'Daily Task' },
    { value: 'social', label: 'Social Media' },
    { value: 'mining', label: 'Mining Related' },
    { value: 'wallet', label: 'Wallet Connection' }
  ];

  const handleSubmit = (data: TaskFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-indigo-500/30 rounded-3xl">
      <CardHeader>
        <CardTitle className="text-white">
          {task ? 'Edit Task' : 'Create New Task'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Title Key</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="e.g., joinTelegram"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reward_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Reward Amount ($SPACE)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        className="bg-white/10 border-white/20 text-white"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="task_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Task Type</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                      >
                        {taskTypes.map(type => (
                          <option key={type.value} value={type.value} className="bg-gray-800">
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="action_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Action URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="https://example.com"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="bg-green-500 hover:bg-green-600"
                disabled={isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {task ? 'Update Task' : 'Create Task'}
              </Button>
              <Button 
                type="button" 
                onClick={onCancel} 
                variant="outline"
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
