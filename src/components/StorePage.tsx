
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
  Coins
} from 'lucide-react';
import { formatTON } from '../utils/ton';

const StorePage = () => {
  const [tonBalance] = useState(5.25); // Example TON balance
  const [tonConnectUI] = useTonConnectUI();
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Premium subscriptions data
  const subscriptions = [
    {
      id: 'basic',
      name: 'Basic Premium',
      description: 'Essential mining boost',
      price: 2.5,
      duration: '1 Month',
      icon: Crown,
      color: 'from-blue-500 to-cyan-600',
      features: [
        '2x Mining Speed',
        '24h Auto Mining',
        'Basic Backgrounds',
        'Priority Support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Pro',
      description: 'Advanced mining power',
      price: 5.0,
      duration: '1 Month',
      icon: Diamond,
      color: 'from-purple-500 to-pink-600',
      popular: true,
      features: [
        '5x Mining Speed',
        'Unlimited Auto Mining',
        'All Backgrounds',
        'VIP Badge',
        'Exclusive Tasks',
        '24/7 Support'
      ]
    },
    {
      id: 'vip',
      name: 'VIP Elite',
      description: 'Ultimate mining experience',
      price: 10.0,
      duration: '1 Month',
      icon: Rocket,
      color: 'from-orange-500 to-red-600',
      features: [
        '10x Mining Speed',
        'Unlimited Auto Mining',
        'Exclusive VIP Backgrounds',
        'Elite Badge',
        'VIP-Only Tasks',
        'Personal Manager',
        'Early Access Features'
      ]
    }
  ];

  // Mining upgrades
  const upgrades = [
    {
      id: 'speed-2x',
      name: 'Speed Boost 2x',
      description: '24 hours mining boost',
      price: 0.5,
      duration: '24h',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'speed-5x',
      name: 'Speed Boost 5x',
      description: '48 hours super boost',
      price: 1.2,
      duration: '48h',
      icon: Zap,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'auto-mining',
      name: 'Auto Mining',
      description: '7 days automatic mining',
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

    if (tonBalance < item.price) {
      toast({
        title: "Insufficient TON",
        description: `You need ${formatTON(item.price)} but only have ${formatTON(tonBalance)}`,
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-3 pb-24">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            TON Store
          </h1>
          <div className="flex items-center justify-center gap-2 bg-gradient-to-br from-slate-800/40 to-blue-900/30 backdrop-blur-xl border border-blue-400/20 rounded-xl p-3">
            <Coins className="w-5 h-5 text-blue-400" />
            <span className="text-white font-bold text-lg">{formatTON(tonBalance)}</span>
          </div>
        </div>

        {/* Premium Subscriptions */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Premium Subscriptions
          </h2>
          
          {subscriptions.map((sub) => {
            const Icon = sub.icon;
            const isPurchased = purchasedItems.includes(sub.id);
            
            return (
              <motion.div
                key={sub.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                {sub.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold">
                    Most Popular
                  </Badge>
                )}
                
                <Card className={`bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-xl border ${sub.popular ? 'border-yellow-400/40' : 'border-blue-400/20'} rounded-2xl ${sub.popular ? 'ring-2 ring-yellow-400/30' : ''}`}>
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-2">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${sub.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl font-bold">
                      {sub.name}
                    </CardTitle>
                    <p className="text-gray-300 text-sm">{sub.description}</p>
                    <div className="text-center mt-2">
                      <span className="text-3xl font-bold text-white">
                        {formatTON(sub.price)}
                      </span>
                      <span className="text-sm ml-2 text-gray-300 font-bold">
                        / {sub.duration}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {sub.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-gray-200">{feature}</span>
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
                      } rounded-xl font-bold py-3 text-sm`}
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

        {/* Mining Upgrades */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Mining Upgrades
          </h2>
          
          {upgrades.map((upgrade) => {
            const Icon = upgrade.icon;
            const isPurchased = purchasedItems.includes(upgrade.id);
            
            return (
              <motion.div
                key={upgrade.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-gradient-to-r ${upgrade.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">
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
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">
                      {formatTON(upgrade.price)}
                    </span>
                    <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                      {upgrade.duration}
                    </Badge>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(upgrade, 'upgrade')}
                    disabled={isPurchased || isProcessing}
                    className={`text-sm py-2 px-4 rounded-lg ${
                      isPurchased 
                        ? 'bg-green-600 cursor-not-allowed' 
                        : `bg-gradient-to-r ${upgrade.color} hover:opacity-90`
                    }`}
                  >
                    {isPurchased ? 'Owned' : 'Buy'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Premium Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-xl border border-yellow-400/20 rounded-2xl text-center"
        >
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-white mb-2">
            Premium Benefits
          </h2>
          <p className="text-gray-300 text-sm">
            Unlock faster mining, exclusive features, and premium support with our subscription plans
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StorePage;
