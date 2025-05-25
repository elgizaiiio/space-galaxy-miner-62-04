
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Star, 
  Users, 
  Share2, 
  Trophy, 
  Gift,
  Settings
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'daily' | 'social' | 'mining' | 'wallet';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  icon: string;
}

const TaskAdminPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<Task>({
    defaultValues: {
      title: '',
      description: '',
      reward: 0,
      type: 'daily',
      difficulty: 'Easy',
      icon: 'Star'
    }
  });

  const iconOptions = [
    { value: 'Star', label: 'Star', Icon: Star },
    { value: 'Users', label: 'Users', Icon: Users },
    { value: 'Share2', label: 'Share', Icon: Share2 },
    { value: 'Trophy', label: 'Trophy', Icon: Trophy },
    { value: 'Gift', label: 'Gift', Icon: Gift }
  ];

  const typeOptions = ['daily', 'social', 'mining', 'wallet'];
  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  const handleSubmit = (data: Task) => {
    if (editingId) {
      setTasks(tasks.map(task => 
        task.id === editingId ? { ...data, id: editingId } : task
      ));
      setEditingId(null);
    } else {
      const newTask = { ...data, id: Date.now().toString() };
      setTasks([...tasks, newTask]);
      setIsCreating(false);
    }
    form.reset();
  };

  const handleEdit = (task: Task) => {
    form.reset(task);
    setEditingId(task.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    form.reset();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-300';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'Hard': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-500/20 text-blue-300';
      case 'social': return 'bg-purple-500/20 text-purple-300';
      case 'mining': return 'bg-orange-500/20 text-orange-300';
      case 'wallet': return 'bg-pink-500/20 text-pink-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Task Management
          </h1>
          <p className="text-gray-300">Manage tasks for users</p>
        </div>

        {/* Add New Task Button */}
        {!isCreating && (
          <div className="flex justify-center">
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          </div>
        )}

        {/* Create/Edit Task Form */}
        {isCreating && (
          <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-indigo-500/30 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-white">
                {editingId ? 'Edit Task' : 'Create New Task'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white/10 border-white/20 text-white" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="bg-white/10 border-white/20 text-white" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Reward ($SPACE)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            className="bg-white/10 border-white/20 text-white"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Type</FormLabel>
                          <FormControl>
                            <select 
                              {...field} 
                              className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                            >
                              {typeOptions.map(type => (
                                <option key={type} value={type} className="bg-gray-800">
                                  {type}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Difficulty</FormLabel>
                          <FormControl>
                            <select 
                              {...field} 
                              className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                            >
                              {difficultyOptions.map(difficulty => (
                                <option key={difficulty} value={difficulty} className="bg-gray-800">
                                  {difficulty}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="icon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Icon</FormLabel>
                          <FormControl>
                            <select 
                              {...field} 
                              className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
                            >
                              {iconOptions.map(({ value, label }) => (
                                <option key={value} value={value} className="bg-gray-800">
                                  {label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="bg-green-500 hover:bg-green-600">
                      <Save className="w-4 h-4 mr-2" />
                      {editingId ? 'Update' : 'Create'}
                    </Button>
                    <Button type="button" onClick={handleCancel} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 backdrop-blur-xl border-2 border-gray-500/30 rounded-3xl">
              <CardContent className="p-8 text-center">
                <p className="text-gray-300">No tasks created yet. Add your first task above.</p>
              </CardContent>
            </Card>
          ) : (
            tasks.map((task) => {
              const IconComponent = iconOptions.find(opt => opt.value === task.icon)?.Icon || Star;
              
              return (
                <Card 
                  key={task.id}
                  className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-indigo-500/30 rounded-3xl overflow-hidden"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/20 rounded-full">
                          <IconComponent className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{task.title}</CardTitle>
                          <div className="flex gap-2 mt-1">
                            <Badge className={getDifficultyColor(task.difficulty)}>
                              {task.difficulty}
                            </Badge>
                            <Badge className={getTypeColor(task.type)}>
                              {task.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(task)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(task.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-300 text-sm mb-4">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-pink-400 font-bold">+{task.reward} $SPACE</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskAdminPage;
