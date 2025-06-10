
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
      setError('Please enter a name');
      return;
    }
    
    if (username.trim().length < 3) {
      setError('Name must be at least 3 characters');
      return;
    }
    
    // Save username to localStorage
    localStorage.setItem('username', username.trim());
    
    // Complete the process
    onComplete(username.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-sm bg-slate-900/95 border border-blue-400/30 text-white" aria-describedby="username-description">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Space Coin
          </DialogTitle>
          <DialogDescription id="username-description" className="text-center text-gray-300 text-sm">
            Please enter your name to continue
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-3 mt-3">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-300 text-sm">
              Name
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter name"
              className="bg-slate-800 border-slate-600 text-white placeholder-gray-400 h-9 text-sm"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-9 text-sm"
          >
            Start Mining
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameModal;
