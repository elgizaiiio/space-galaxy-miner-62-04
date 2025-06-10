
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTranslation } from '../utils/language';

interface UsernameModalProps {
  isOpen: boolean;
  onComplete: (username: string) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ isOpen, onComplete }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('يرجى إدخال اسم المستخدم');
      return;
    }
    
    if (username.trim().length < 3) {
      setError('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
      return;
    }
    
    // Save username to localStorage
    localStorage.setItem('username', username.trim());
    
    // Complete the process
    onComplete(username.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-slate-900/95 border border-blue-400/30 text-white" aria-describedby="username-description">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            مرحباً بك في Space Coin
          </DialogTitle>
          <DialogDescription id="username-description" className="text-center text-gray-300">
            يرجى إدخال اسم المستخدم الخاص بك للمتابعة
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300">
              اسم المستخدم
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="أدخل اسم المستخدم"
              className="bg-slate-800 border-slate-600 text-white placeholder-gray-400"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            بدء التعدين
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameModal;
