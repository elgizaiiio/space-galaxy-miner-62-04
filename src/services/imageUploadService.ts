
import { supabase } from '@/integrations/supabase/client';

export const imageUploadService = {
  async uploadTaskImage(file: File, taskId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `task-${taskId}-${Date.now()}.${fileExt}`;
      const filePath = `task-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('task-images')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('task-images')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  },

  async deleteTaskImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const filePath = url.pathname.split('/').slice(-2).join('/');
      
      const { error } = await supabase.storage
        .from('task-images')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image:', error);
        throw error;
      }
    } catch (error) {
      console.error('Image deletion failed:', error);
      throw error;
    }
  }
};
