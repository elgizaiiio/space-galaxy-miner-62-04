
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

interface UsernameModalProps {
  isOpen: boolean;
  onComplete: (username: string) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ isOpen, onComplete }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    if (username.trim()) {
      localStorage.setItem('username', username.trim());
      onComplete(username.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="bg-gradient-to-br from-slate-900/98 via-indigo-900/95 to-purple-900/98 backdrop-blur-xl border-2 border-indigo-500/30 text-white max-w-xs rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-lg">
              <User className="w-3 h-3 text-blue-400" />
            </div>
            <DialogTitle className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to $SPACE
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-3">
          <p className="text-xs text-gray-300 text-center">
            اكتب اسمك لبدء التعدين
          </p>
          
          <div>
            <Label htmlFor="username" className="text-white mb-1 block text-xs font-medium">
              الاسم
            </Label>
            <Input
              id="username"
              placeholder="اكتب اسمك"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400 h-8 text-sm rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!username.trim()}
            className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 h-8 text-sm font-semibold rounded-lg shadow-lg disabled:opacity-50"
          >
            ابدأ التعدين
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameModal;
