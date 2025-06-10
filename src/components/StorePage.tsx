
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { useTonConnectUI } from '@tonconnect/ui-react';
import { 
  Store,
  Crown, 
  Zap, 
  Star,
  Rocket,
  CheckCircle,
  Diamond,
  Shield,
  Sparkles,
  Clock,
  Coins
} from 'lucide-react';
import { formatTON } from '../utils/ton';

const StorePage = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const coinPacks = [
    {
      id: 'space-50k',
      name: '50,000 SPACE',
      description: 'Instant coin pack',
      price: 1.0,
      coins: 50000,
      icon: Coins,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'space-100k',
      name: '100,000 SPACE',
      description: 'Double coin pack',
      price: 2.0,
      coins: 100000,
      icon: Coins,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'space-250k',
      name: '250,000 SPACE',
      description: 'Mega coin pack',
      price: 5.0,
      coins: 250000,
      icon: Coins,
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 'space-500k',
      name: '500,000 SPACE',
      description: 'Ultra coin pack',
      price: 10.0,
      coins: 500000,
      icon: Coins,
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const subscriptions = [
    {
      id: 'basic',
      name: 'Basic Pro',
      description: 'Essential mining boost',
      price: 2.5,
      duration: '1 month',
      icon: Crown,
      color: 'from-blue-500 to-cyan-500',
      features: [
        '2x mining speed',
        '24h auto mining',
        'Basic themes'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Elite',
      description: 'Advanced mining power',
      price: 5.0,
      duration: '1 month',
      icon: Diamond,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        '5x mining speed',
        'Unlimited auto mining',
        'Premium themes',
        'VIP badge',
        'Priority support'
      ]
    },
    {
      id: 'vip',
      name: 'VIP Ultimate',
      description: 'Maximum mining experience',
      price: 10.0,
      duration: '1 month',
      icon: Rocket,
      color: 'from-orange-500 to-red-500',
      features: [
        '10x mining speed',
        'Unlimited auto mining',
        'Exclusive themes',
        'Elite badge',
        '24/7 VIP support'
      ]
    }
  ];

  const upgrades = [
    {
      id: 'speed-2x',
      name: '2x Speed',
      description: '24 hours boost',
      price: 0.5,
      duration: '24h',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'speed-5x',
      name: '5x Speed',
      description: '48 hours boost',
      price: 1.2,
      duration: '48h',
      icon: Zap,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'auto-mining',
      name: 'Auto Mining',
      description: '7 days automatic',
      price: 2.0,
      duration: '7d',
      icon: Shield,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const handlePurchase = async (item: any, type: 'subscription' | 'upgrade' | 'coins') => {
    if (!tonConnectUI.wallet) {
      toast({
        title: "Wallet Required",
        description: "Connect your TON wallet first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{
          address: 'UQASDdSDAEVR8h5faVs7m8ZSxt-ib4I87gQHUoSrOXszNxxf',
          amount: (item.price * 1e9).toString()
        }]
      };

      await tonConnectUI.sendTransaction(transaction);
      setPurchasedItems(prev => [...prev, item.id]);
      
      if (type === 'subscription') {
        localStorage.setItem('activeSubscription', item.id);
        localStorage.setItem('subscriptionExpiry', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
      } else if (type === 'coins') {
        // Add coins to user's balance
        const currentCoins = parseFloat(localStorage.getItem('spaceCoins') || '0');
        const newBalance = currentCoins + item.coins;
        localStorage.setItem('spaceCoins', newBalance.toString());
      }

      toast({
        title: "Success!",
        description: type === 'coins' ? `${item.coins.toLocaleString()} SPACE coins added to your balance` : `${item.name} activated`
      });
    } catch (error) {
      console.error('Purchase failed:', error);
      toast({
        title: "Failed",
        description: "Payment failed",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-3 pb-20"
    >
      <div className="max-w-sm mx-auto space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-4"
        >
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Store className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Premium Store
          </h1>
          <p className="text-gray-300 text-sm">
            Boost your mining power
          </p>
        </motion.div>

        {/* SPACE Coins */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Coins className="w-4 h-4 text-yellow-400" />
            <h2 className="text-lg font-bold text-white">SPACE Coins</h2>
          </div>
          
          {coinPacks.map((pack, index) => {
            const Icon = pack.icon;
            const isPurchased = purchasedItems.includes(pack.id);
            
            return (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {pack.popular && (
                  <Badge className="absolute -top-1 left-3 z-10 bg-yellow-500 text-black text-xs px-2 py-0">
                    Popular
                  </Badge>
                )}
                
                <Card className={`bg-slate-800/50 backdrop-blur border ${pack.popular ? 'border-yellow-400/50' : 'border-slate-600/50'} ${pack.popular ? 'ring-1 ring-yellow-400/30' : ''}`}>
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${pack.color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-base font-bold">
                            {pack.name}
                          </CardTitle>
                          <p className="text-gray-400 text-xs">{pack.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {formatTON(pack.price)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 pb-3">
                    <Button 
                      onClick={() => handlePurchase(pack, 'coins')} 
                      disabled={isProcessing} 
                      className={`w-full h-8 text-xs font-bold bg-gradient-to-r ${pack.color} hover:opacity-90`}
                    >
                      {isProcessing ? 'Processing...' : 'Buy Now'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Subscriptions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-yellow-400" />
            <h2 className="text-lg font-bold text-white">Subscriptions</h2>
          </div>
          
          {subscriptions.map((sub, index) => {
            const Icon = sub.icon;
            const isPurchased = purchasedItems.includes(sub.id);
            
            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="relative"
              >
                {sub.popular && (
                  <Badge className="absolute -top-1 left-3 z-10 bg-yellow-500 text-black text-xs px-2 py-0">
                    Popular
                  </Badge>
                )}
                
                <Card className={`bg-slate-800/50 backdrop-blur border ${sub.popular ? 'border-yellow-400/50' : 'border-slate-600/50'} ${sub.popular ? 'ring-1 ring-yellow-400/30' : ''}`}>
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${sub.color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-base font-bold">
                            {sub.name}
                          </CardTitle>
                          <p className="text-gray-400 text-xs">{sub.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {formatTON(sub.price)}
                        </div>
                        <div className="text-xs text-gray-400">
                          /{sub.duration}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 pb-3">
                    <div className="space-y-1 mb-3">
                      {sub.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span className="text-xs text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handlePurchase(sub, 'subscription')} 
                      disabled={isPurchased || isProcessing} 
                      className={`w-full h-8 text-xs font-bold ${
                        isPurchased 
                          ? 'bg-green-600 hover:bg-green-600' 
                          : `bg-gradient-to-r ${sub.color} hover:opacity-90`
                      }`}
                    >
                      {isProcessing 
                        ? 'Processing...' 
                        : isPurchased 
                          ? 'Active' 
                          : 'Subscribe'
                      }
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Upgrades */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h2 className="text-lg font-bold text-white">Boosts</h2>
          </div>
          
          {upgrades.map((upgrade, index) => {
            const Icon = upgrade.icon;
            const isPurchased = purchasedItems.includes(upgrade.id);
            
            return (
              <motion.div
                key={upgrade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur border border-slate-600/50 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${upgrade.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">
                        {upgrade.name}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {upgrade.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-blue-400">{upgrade.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-bold text-white mb-1">
                      {formatTON(upgrade.price)}
                    </div>
                    <Button
                      onClick={() => handlePurchase(upgrade, 'upgrade')}
                      disabled={isPurchased || isProcessing}
                      size="sm"
                      className={`h-7 px-3 text-xs font-bold ${
                        isPurchased 
                          ? 'bg-green-600 cursor-not-allowed' 
                          : `bg-gradient-to-r ${upgrade.color} hover:opacity-90`
                      }`}
                    >
                      {isPurchased ? 'Owned' : 'Buy'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="p-4 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 backdrop-blur border border-yellow-400/30 rounded-lg text-center"
        >
          <Sparkles className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white mb-1">
            Premium Benefits
          </h3>
          <p className="text-gray-300 text-xs">
            Unlock faster mining and exclusive features
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StorePage;
