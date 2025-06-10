
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { 
  Coins, 
  Play,
} from 'lucide-react';

const MiningPage = () => {
  const [spaceCoins, setSpaceCoins] = useState(0);
  const [miningSpeed, setMiningSpeed] = useState(1);
  const [coinsPerSecond, setCoinsPerSecond] = useState(0.1);
  const [miningActive, setMiningActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(28800); // 8 hours
  const [username, setUsername] = useState('');
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if username exists in localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setShowUsernamePrompt(true);
    }

    const storedCoins = localStorage.getItem('spaceCoins');
    if (storedCoins) {
      setSpaceCoins(parseFloat(storedCoins));
    }

    const storedMiningSpeed = localStorage.getItem('miningSpeed');
    if (storedMiningSpeed) {
      setMiningSpeed(parseFloat(storedMiningSpeed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('spaceCoins', spaceCoins.toString());
  }, [spaceCoins]);

  useEffect(() => {
    localStorage.setItem('miningSpeed', miningSpeed.toString());
    setCoinsPerSecond(0.1 * miningSpeed);
  }, [miningSpeed]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (miningActive) {
      intervalId = setInterval(() => {
        setSpaceCoins((prevCoins) => prevCoins + coinsPerSecond);
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            setMiningActive(false);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [miningActive, coinsPerSecond]);

  const handleUsernameSubmit = (inputUsername: string) => {
    if (inputUsername.trim()) {
      setUsername(inputUsername.trim());
      localStorage.setItem('username', inputUsername.trim());
      setShowUsernamePrompt(false);
    }
  };

  const handleStartMining = () => {
    if (miningActive) {
      setMiningActive(false);
    } else {
      setMiningActive(true);
      setRemainingTime(28800); // 8 hours
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen relative p-4 pb-20 overflow-hidden">
      {/* Username Prompt Modal */}
      {showUsernamePrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Welcome!</h2>
            <p className="text-gray-300 mb-4 text-center">Please enter your username:</p>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUsernameSubmit((e.target as HTMLInputElement).value);
                }
              }}
              autoFocus
            />
            <Button
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                handleUsernameSubmit(input.value);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Background Image - Full Screen Coverage */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/e80a217f-cec9-4e53-bb98-cb1000455827.png')`
        }}
      />
      
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-black/30" />
      
      <div className="max-w-xs mx-auto space-y-6 relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Logo without glow */}
        <div className="relative flex justify-center items-center mb-4">
          <div className="w-48 h-48 rounded-full border-4 border-blue-500/50 flex items-center justify-center">
            <img 
              src="/lovable-uploads/d391ae90-26f4-41e1-b5c8-5451cc3c1664.png" 
              alt="SPACE AI Logo"
              className="w-32 h-32 object-cover rounded-full"
            />
            {/* Mining wave effect inside circle when active */}
            {miningActive && (
              <div className="absolute inset-0 rounded-full border-4 border-transparent">
                <div className="w-full h-full relative overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/30 to-transparent animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Username */}
        {username && (
          <div className="text-center mb-6">
            <p className="text-white text-lg font-medium">{username}</p>
          </div>
        )}

        {/* Balance */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-2xl font-bold">
            {Math.floor(spaceCoins).toLocaleString()}
          </span>
        </div>

        {/* Mining Status - Only show when mining is active */}
        {miningActive && (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 w-full border border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm">Farming</span>
                <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                  <Coins className="w-2 h-2 text-white" />
                </div>
                <span className="text-white text-sm font-medium">
                  {(coinsPerSecond * 3600).toFixed(1)}
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                {formatTime(remainingTime)}
              </span>
            </div>
          </div>
        )}

        {/* Start Mining Button - Only show when not mining */}
        {!miningActive && (
          <Button
            onClick={handleStartMining}
            className="w-full py-4 text-lg font-bold rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <div className="flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              <span>Start Mining</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default MiningPage;
