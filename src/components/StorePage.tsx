
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingCart, 
  Zap, 
  Palette, 
  Crown,
  Star,
  Coins,
  Lock,
  Check
} from 'lucide-react';

const StorePage = () => {
  const [spaceCoins, setSpaceCoins] = useState(1000); // Example balance
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const { toast } = useToast();

  const upgrades = [
    {
      id: 'speed-2x',
      name: 'Speed Boost 2x',
      description: 'Double your mining speed',
      price: 500,
      icon: Zap,
      type: 'upgrade'
    },
    {
      id: 'speed-5x',
      name: 'Speed Boost 5x',
      description: 'Multiply mining speed by 5',
      price: 2000,
      icon: Zap,
      type: 'upgrade'
    },
    {
      id: 'auto-mining',
      name: 'Auto Mining',
      description: '24h automatic mining',
      price: 1500,
      icon: Crown,
      type: 'upgrade'
    }
  ];

  const backgrounds = [
    {
      id: 'nebula',
      name: 'Cosmic Nebula',
      description: 'Beautiful nebula background',
      price: 300,
      icon: Star,
      type: 'background',
      preview: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'galaxy',
      name: 'Galaxy Theme',
      description: 'Spiral galaxy background',
      price: 500,
      icon: Star,
      type: 'background',
      preview: 'linear-gradient(45deg, #2196F3 0%, #9C27B0 100%)'
    },
    {
      id: 'solar',
      name: 'Solar System',
      description: 'Planets and stars theme',
      price: 800,
      icon: Star,
      type: 'background',
      preview: 'linear-gradient(45deg, #FF9800 0%, #FF5722 100%)'
    }
  ];

  const handlePurchase = (item: any) => {
    if (spaceCoins >= item.price && !purchasedItems.includes(item.id)) {
      setSpaceCoins(prev => prev - item.price);
      setPurchasedItems(prev => [...prev, item.id]);
      toast({
        title: "Purchase Successful!",
        description: `You bought ${item.name}`,
      });
    } else if (purchasedItems.includes(item.id)) {
      toast({
        title: "Already Purchased",
        description: "You already own this item",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough $SPACE coins",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-2 pb-20">
      <div className="max-w-sm mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            $SPACE Store
          </h1>
          <div className="flex items-center justify-center gap-2 bg-gradient-to-br from-slate-800/40 to-blue-900/30 backdrop-blur-xl border border-blue-400/20 rounded-xl p-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-bold">{spaceCoins.toLocaleString()}</span>
            <span className="text-blue-300 text-sm">$SPACE</span>
          </div>
        </div>

        {/* Mining Upgrades Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Mining Upgrades
          </h2>
          
          {upgrades.map((upgrade) => {
            const Icon = upgrade.icon;
            const isPurchased = purchasedItems.includes(upgrade.id);
            const canAfford = spaceCoins >= upgrade.price;
            
            return (
              <motion.div
                key={upgrade.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-3 shadow-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-yellow-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {upgrade.name}
                      </h3>
                      <p className="text-xs text-gray-300">
                        {upgrade.description}
                      </p>
                    </div>
                  </div>
                  {isPurchased && (
                    <Check className="w-5 h-5 text-green-400" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span className="text-white font-bold text-sm">
                      {upgrade.price.toLocaleString()}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(upgrade)}
                    disabled={isPurchased || !canAfford}
                    className={`text-xs py-1 px-3 rounded-lg ${
                      isPurchased 
                        ? 'bg-green-600 cursor-not-allowed' 
                        : canAfford
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {isPurchased ? 'Owned' : canAfford ? 'Buy' : 'Locked'}
                    {!canAfford && !isPurchased && <Lock className="w-3 h-3 ml-1" />}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Backgrounds Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            Backgrounds
          </h2>
          
          {backgrounds.map((background) => {
            const Icon = background.icon;
            const isPurchased = purchasedItems.includes(background.id);
            const canAfford = spaceCoins >= background.price;
            
            return (
              <motion.div
                key={background.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-3 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-10 h-10 rounded-lg border-2 border-white/20"
                    style={{ background: background.preview }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">
                        {background.name}
                      </h3>
                      {isPurchased && (
                        <Check className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-300">
                      {background.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 text-yellow-400" />
                    <span className="text-white font-bold text-sm">
                      {background.price.toLocaleString()}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(background)}
                    disabled={isPurchased || !canAfford}
                    className={`text-xs py-1 px-3 rounded-lg ${
                      isPurchased 
                        ? 'bg-green-600 cursor-not-allowed' 
                        : canAfford
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {isPurchased ? 'Owned' : canAfford ? 'Buy' : 'Locked'}
                    {!canAfford && !isPurchased && <Lock className="w-3 h-3 ml-1" />}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-3 bg-gradient-to-br from-orange-900/30 to-red-900/30 backdrop-blur-xl border border-orange-400/20 rounded-2xl shadow-xl text-center"
        >
          <h2 className="text-sm font-bold text-white mb-1">
            Coming Soon
          </h2>
          <p className="text-gray-300 text-xs mb-2">
            More upgrades and themes will be available soon!
          </p>
          <div className="flex justify-center">
            <ShoppingCart className="w-5 h-5 text-orange-400" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StorePage;
