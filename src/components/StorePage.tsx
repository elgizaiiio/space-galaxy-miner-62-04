
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { useTonConnectUI } from '@tonconnect/ui-react';
import { 
  Crown, 
  Zap, 
  Star,
  Rocket,
  CheckCircle,
  Diamond,
  Shield,
  Coins,
  Sparkles
} from 'lucide-react';
import { formatTON } from '../utils/ton';

const StorePage = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const subscriptions = [
    {
      id: 'basic',
      name: 'Basic Premium',
      description: 'Essential mining boost',
      price: 2.5,
      duration: '1 month',
      icon: Crown,
      color: 'from-blue-500 to-cyan-600',
      features: [
        '2x mining speed',
        '24h auto mining',
        'Basic backgrounds'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Pro',
      description: 'Advanced mining power',
      price: 5.0,
      duration: '1 month',
      icon: Diamond,
      color: 'from-purple-500 to-pink-600',
      popular: true,
      features: [
        '5x mining speed',
        'Unlimited auto mining',
        'All backgrounds',
        'VIP badge'
      ]
    },
    {
      id: 'vip',
      name: 'VIP Elite',
      description: 'Ultimate mining experience',
      price: 10.0,
      duration: '1 month',
      icon: Rocket,
      color: 'from-orange-500 to-red-600',
      features: [
        '10x mining speed',
        'Unlimited auto mining',
        'Exclusive VIP backgrounds',
        'Elite badge'
      ]
    }
  ];

  const upgrades = [
    {
      id: 'speed-2x',
      name: '2x Speed Boost',
      description: 'Mining boost for 24 hours',
      price: 0.5,
      duration: '24 hours',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'speed-5x',
      name: '5x Speed Boost',
      description: 'Super boost for 48 hours',
      price: 1.2,
      duration: '48 hours',
      icon: Zap,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'auto-mining',
      name: 'Auto Mining',
      description: 'Automatic mining for 7 days',
      price: 2.0,
      duration: '7 days',
      icon: Shield,
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const handlePurchase = async (item: any, type: 'subscription' | 'upgrade') => {
    if (!tonConnectUI.wallet) {
      toast({
        title: "Wallet Required",
        description: "Please connect your TON wallet first",
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
      }

      toast({
        title: "Purchase Successful!",
        description: `${item.name} activated successfully!`
      });
    } catch (error) {
      console.error('Purchase failed:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="min-h-screen p-4 pb-20 relative"
      style={{
        backgroundImage: `url(/lovable-uploads/0636abc4-6032-4f0c-872d-cfc4ff30f6f3.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-md mx-auto space-y-6 relative z-10">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3"
          >
            Premium Store
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-300 text-base"
          >
            Unlock premium features and boost your mining
          </motion.p>
        </div>

        <div className="space-y-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl font-bold text-white flex items-center gap-2"
          >
            <Crown className="w-6 h-6 text-yellow-400" />
            Premium Subscriptions
          </motion.h2>
          
          {subscriptions.map((sub, index) => {
            const Icon = sub.icon;
            const isPurchased = purchasedItems.includes(sub.id);
            
            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                {sub.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold text-sm">
                    Most Popular
                  </Badge>
                )}
                
                <Card className={`bg-gradient-to-br from-slate-800/60 via-blue-900/40 to-purple-900/50 backdrop-blur-lg border ${sub.popular ? 'border-yellow-400/50' : 'border-blue-400/30'} rounded-xl shadow-xl ${sub.popular ? 'ring-2 ring-yellow-400/30' : ''}`}>
                  <CardHeader className="text-center pb-4 pt-6">
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${sub.color} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl font-bold">
                      {sub.name}
                    </CardTitle>
                    <p className="text-gray-300 text-sm">{sub.description}</p>
                    <div className="text-center mt-3">
                      <span className="text-2xl font-bold text-white">
                        {formatTON(sub.price)}
                      </span>
                      <span className="text-sm ml-2 text-gray-300 font-medium">
                        / {sub.duration}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 pt-0">
                    <div className="space-y-3">
                      {sub.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-gray-200 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handlePurchase(sub, 'subscription')} 
                      disabled={isPurchased || isProcessing} 
                      className={`w-full mt-4 ${
                        isPurchased 
                          ? 'bg-green-600 hover:bg-green-600 cursor-default' 
                          : `bg-gradient-to-r ${sub.color} hover:opacity-90`
                      } rounded-lg font-bold py-3 text-sm shadow-lg transition-all duration-300`}
                    >
                      {isProcessing 
                        ? 'Processing...' 
                        : isPurchased 
                          ? 'Active' 
                          : 'Subscribe Now'
                      }
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-xl font-bold text-white flex items-center gap-2"
          >
            <Zap className="w-6 h-6 text-yellow-400" />
            Mining Upgrades
          </motion.h2>
          
          {upgrades.map((upgrade, index) => {
            const Icon = upgrade.icon;
            const isPurchased = purchasedItems.includes(upgrade.id);
            
            return (
              <motion.div
                key={upgrade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-slate-800/60 via-blue-900/40 to-purple-900/50 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-gradient-to-r ${upgrade.color} shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">
                        {upgrade.name}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {upgrade.description}
                      </p>
                    </div>
                  </div>
                  {isPurchased && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-base">
                      {formatTON(upgrade.price)}
                    </span>
                    <Badge className="bg-blue-500/30 text-blue-300 text-sm font-medium">
                      {upgrade.duration}
                    </Badge>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(upgrade, 'upgrade')}
                    disabled={isPurchased || isProcessing}
                    className={`text-sm py-2 px-6 rounded-lg font-bold shadow-lg transition-all duration-300 ${
                      isPurchased 
                        ? 'bg-green-600 cursor-not-allowed' 
                        : `bg-gradient-to-r ${upgrade.color} hover:opacity-90 hover:scale-105`
                    }`}
                  >
                    {isPurchased ? 'Owned' : 'Buy Now'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="p-6 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-lg border border-yellow-400/30 rounded-xl text-center shadow-xl"
        >
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3 animate-pulse" />
          <h2 className="text-lg font-bold text-white mb-2">
            Premium Benefits
          </h2>
          <p className="text-gray-300 text-sm">
            Unlock faster mining and exclusive features with subscription plans
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StorePage;
