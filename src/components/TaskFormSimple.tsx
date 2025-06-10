
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Upload, Image, Trash2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];
type NewTask = Database['public']['Tables']['tasks']['Insert'];

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: NewTask) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const TaskFormSimple: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    title_key: task?.title_key || '',
    task_type: task?.task_type || 'daily',
    reward_amount: task?.reward_amount || 100,
    action_url: task?.action_url || '',
    is_active: task?.is_active ?? true
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-indigo-500/30 rounded-3xl">
      <CardHeader>
        <CardTitle className="text-white">
          {task ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title_key" className="text-white">عنوان المهمة</Label>
              <Input
                id="title_key"
                value={formData.title_key}
                onChange={(e) => handleInputChange('title_key', e.target.value)}
                placeholder="مثال: انضم إلى التليجرام"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="task_type" className="text-white">نوع المهمة</Label>
              <Select 
                value={formData.task_type} 
                onValueChange={(value) => handleInputChange('task_type', value)}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومية</SelectItem>
                  <SelectItem value="social">وسائل التواصل</SelectItem>
                  <SelectItem value="mining">التعدين</SelectItem>
                  <SelectItem value="wallet">المحفظة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reward_amount" className="text-white">مكافأة المهمة</Label>
              <Input
                id="reward_amount"
                type="number"
                min="1"
                value={formData.reward_amount}
                onChange={(e) => handleInputChange('reward_amount', parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="action_url" className="text-white">رابط المهمة (اختياري)</Label>
              <Input
                id="action_url"
                type="url"
                value={formData.action_url}
                onChange={(e) => handleInputChange('action_url', e.target.value)}
                placeholder="https://..."
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <Label className="text-white mb-3 block">صورة المهمة (اختياري)</Label>
            
            {imagePreview ? (
              <div className="space-y-3">
                <div className="relative w-full h-40 bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="معاينة صورة المهمة" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-white/50 transition-colors bg-white/5"
              >
                <Image className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-400 text-sm text-center">
                  اضغط لاختيار صورة<br />
                  <span className="text-xs">PNG, JPG, GIF (حد أقصى 5MB)</span>
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={isLoading}
            />

            {!imagePreview && (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="mt-3 text-white border-white/20 hover:bg-white/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                اختيار صورة
              </Button>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <X className="w-4 h-4 mr-2" />
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'جاري الحفظ...' : (task ? 'تحديث المهمة' : 'إضافة المهمة')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskFormSimple;
