
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen flex flex-col overflow-hidden">
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
          backgroundImage: `url('/lovable-uploads/d391ae90-26f4-41e1-b5c8-5451cc3c1664.png')`
        }}
      />
      
      {/* Content positioned at bottom */}
      <div className="flex-1 flex flex-col justify-end relative z-10 p-6 pb-20">
        {/* Username */}
        {username && (
          <div className="text-center mb-4">
            <p className="text-white text-2xl font-bold">{username}</p>
          </div>
        )}

        {/* Balance */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-3xl font-bold">
            {Math.floor(spaceCoins).toLocaleString()}
          </span>
        </div>

        {/* Mining Time Display - Only show when mining is active */}
        {miningActive && (
          <div className="text-center mb-4">
            <p className="text-gray-300 text-lg">Mining Time Left:</p>
            <p className="text-white text-xl font-bold">{formatTime(remainingTime)}</p>
          </div>
        )}

        {/* Start Mining Button - Only show when not mining */}
        {!miningActive && (
          <div className="flex justify-center">
            <Button
              onClick={handleStartMining}
              className="py-4 px-8 text-lg font-bold rounded-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <div className="flex items-center justify-center gap-2">
                <Play className="w-5 h-5" />
                <span>Start Mining</span>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiningPage;
