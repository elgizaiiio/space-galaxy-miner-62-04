
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
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

  // منع التمرير عند تحميل الصفحة
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

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

    // Check if mining was active when user left
    const miningStartTime = localStorage.getItem('miningStartTime');
    const miningDuration = localStorage.getItem('miningDuration');
    
    if (miningStartTime && miningDuration) {
      const startTime = parseInt(miningStartTime);
      const duration = parseInt(miningDuration);
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
      
      if (elapsedTime < duration) {
        // Mining is still active
        setMiningActive(true);
        setRemainingTime(duration - elapsedTime);
        
        // Calculate coins earned while away
        const coinsEarned = elapsedTime * (0.1 * (storedMiningSpeed ? parseFloat(storedMiningSpeed) : 1));
        const previousCoins = storedCoins ? parseFloat(storedCoins) : 0;
        setSpaceCoins(previousCoins + coinsEarned);
      } else {
        // Mining session completed while away
        localStorage.removeItem('miningStartTime');
        localStorage.removeItem('miningDuration');
        setMiningActive(false);
        setRemainingTime(28800);
        
        // Add all coins from completed session
        const totalCoinsEarned = duration * (0.1 * (storedMiningSpeed ? parseFloat(storedMiningSpeed) : 1));
        const previousCoins = storedCoins ? parseFloat(storedCoins) : 0;
        setSpaceCoins(previousCoins + totalCoinsEarned);
      }
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
        setSpaceCoins((prevCoins) => {
          const newCoins = prevCoins + coinsPerSecond;
          localStorage.setItem('spaceCoins', newCoins.toString());
          return newCoins;
        });
        
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            setMiningActive(false);
            localStorage.removeItem('miningStartTime');
            localStorage.removeItem('miningDuration');
            return 0;
          }
          return newTime;
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
      // Stop mining
      setMiningActive(false);
      localStorage.removeItem('miningStartTime');
      localStorage.removeItem('miningDuration');
    } else {
      // Start mining
      const currentTime = Date.now();
      const duration = 28800; // 8 hours in seconds
      
      localStorage.setItem('miningStartTime', currentTime.toString());
      localStorage.setItem('miningDuration', duration.toString());
      
      setMiningActive(true);
      setRemainingTime(duration);
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
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
          backgroundImage: `url('/lovable-uploads/e81290d1-496b-463f-8504-08f1bd2ce75c.png')`
        }}
      />
      
      {/* Content positioned at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-10 p-6 pb-20 flex flex-col items-center">
        {/* Username */}
        {username && (
          <div className="text-center mb-4">
            <p className="text-white text-2xl font-bold">{username}</p>
          </div>
        )}

        {/* Balance */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="/lovable-uploads/46b9f7e6-4f32-4240-9fc4-16d1bcdec0d0.png" 
              alt="Space Coin"
              className="w-full h-full object-cover"
            />
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
