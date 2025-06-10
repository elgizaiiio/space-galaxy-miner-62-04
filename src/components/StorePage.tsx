
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
  const [tonBalance] = useState(5.25);
  const [tonConnectUI] = useTonConnectUI();
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const subscriptions = [
    {
      id: 'basic',
      name: 'Basic Premium',
      description: 'تعزيز التعدين الأساسي',
      price: 2.5,
      duration: 'شهر واحد',
      icon: Crown,
      color: 'from-blue-500 to-cyan-600',
      features: [
        'سرعة تعدين 2x',
        'تعدين تلقائي 24 ساعة',
        'خلفيات أساسية'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Pro',
      description: 'قوة تعدين متقدمة',
      price: 5.0,
      duration: 'شهر واحد',
      icon: Diamond,
      color: 'from-purple-500 to-pink-600',
      popular: true,
      features: [
        'سرعة تعدين 5x',
        'تعدين تلقائي غير محدود',
        'جميع الخلفيات',
        'شارة VIP'
      ]
    },
    {
      id: 'vip',
      name: 'VIP Elite',
      description: 'تجربة التعدين النهائية',
      price: 10.0,
      duration: 'شهر واحد',
      icon: Rocket,
      color: 'from-orange-500 to-red-600',
      features: [
        'سرعة تعدين 10x',
        'تعدين تلقائي غير محدود',
        'خلفيات VIP حصرية',
        'شارة النخبة'
      ]
    }
  ];

  const upgrades = [
    {
      id: 'speed-2x',
      name: 'تعزيز السرعة 2x',
      description: 'تعزيز التعدين لمدة 24 ساعة',
      price: 0.5,
      duration: '24 ساعة',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'speed-5x',
      name: 'تعزيز السرعة 5x',
      description: 'تعزيز فائق لمدة 48 ساعة',
      price: 1.2,
      duration: '48 ساعة',
      icon: Zap,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'auto-mining',
      name: 'التعدين التلقائي',
      description: 'تعدين تلقائي لمدة 7 أيام',
      price: 2.0,
      duration: '7 أيام',
      icon: Shield,
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  const handlePurchase = async (item: any, type: 'subscription' | 'upgrade') => {
    if (!tonConnectUI.wallet) {
      toast({
        title: "المحفظة مطلوبة",
        description: "يرجى ربط محفظة TON الخاصة بك أولاً",
        variant: "destructive"
      });
      return;
    }

    if (tonBalance < item.price) {
      toast({
        title: "TON غير كافي",
        description: `تحتاج إلى ${formatTON(item.price)} ولكن لديك فقط ${formatTON(tonBalance)}`,
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
        title: "الشراء تم بنجاح!",
        description: `تم تفعيل ${item.name} بنجاح!`
      });
    } catch (error) {
      console.error('Purchase failed:', error);
      toast({
        title: "فشل الدفع",
        description: "فشل في معالجة الدفعة",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="min-h-screen p-2 pb-20 relative"
      style={{
        backgroundImage: `url(/lovable-uploads/0636abc4-6032-4f0c-872d-cfc4ff30f6f3.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-md mx-auto space-y-3 relative z-10">
        <div className="text-center mb-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center mb-2"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
          >
            متجر TON
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2 bg-gradient-to-br from-slate-800/60 to-blue-900/50 backdrop-blur-lg border border-blue-400/30 rounded-lg p-2 shadow-lg"
          >
            <Coins className="w-4 h-4 text-blue-400" />
            <span className="text-white font-bold text-sm">{formatTON(tonBalance)}</span>
            <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg font-bold text-white flex items-center gap-2"
          >
            <Crown className="w-5 h-5 text-yellow-400" />
            اشتراكات بريميوم
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
                  <Badge className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold text-xs">
                    الأكثر شعبية
                  </Badge>
                )}
                
                <Card className={`bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-lg border ${sub.popular ? 'border-yellow-400/50' : 'border-blue-400/20'} rounded-xl shadow-lg ${sub.popular ? 'ring-1 ring-yellow-400/30' : ''}`}>
                  <CardHeader className="text-center pb-2 pt-3">
                    <div className="flex justify-center mb-2">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${sub.color} shadow-md`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg font-bold">
                      {sub.name}
                    </CardTitle>
                    <p className="text-gray-300 text-xs">{sub.description}</p>
                    <div className="text-center mt-2">
                      <span className="text-xl font-bold text-white">
                        {formatTON(sub.price)}
                      </span>
                      <span className="text-xs ml-1 text-gray-300 font-medium">
                        / {sub.duration}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-2">
                      {sub.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                          <span className="text-xs text-gray-200 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handlePurchase(sub, 'subscription')} 
                      disabled={isPurchased || isProcessing} 
                      className={`w-full mt-3 ${
                        isPurchased 
                          ? 'bg-green-600 hover:bg-green-600 cursor-default' 
                          : `bg-gradient-to-r ${sub.color} hover:opacity-90`
                      } rounded-lg font-bold py-2 text-xs shadow-md transition-all duration-300`}
                    >
                      {isProcessing 
                        ? 'جاري المعالجة...' 
                        : isPurchased 
                          ? 'مفعل' 
                          : 'اشترك الآن'
                      }
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-3">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-lg font-bold text-white flex items-center gap-2"
          >
            <Zap className="w-5 h-5 text-yellow-400" />
            ترقيات التعدين
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
                className="bg-gradient-to-br from-slate-800/40 via-blue-900/30 to-purple-900/40 backdrop-blur-lg border border-blue-400/20 rounded-xl p-3 shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full bg-gradient-to-r ${upgrade.color} shadow-md`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">
                        {upgrade.name}
                      </h3>
                      <p className="text-gray-300 text-xs">
                        {upgrade.description}
                      </p>
                    </div>
                  </div>
                  {isPurchased && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">
                      {formatTON(upgrade.price)}
                    </span>
                    <Badge className="bg-blue-500/30 text-blue-300 text-xs font-medium">
                      {upgrade.duration}
                    </Badge>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchase(upgrade, 'upgrade')}
                    disabled={isPurchased || isProcessing}
                    className={`text-xs py-1 px-4 rounded-lg font-bold shadow-md transition-all duration-300 ${
                      isPurchased 
                        ? 'bg-green-600 cursor-not-allowed' 
                        : `bg-gradient-to-r ${upgrade.color} hover:opacity-90 hover:scale-105`
                    }`}
                  >
                    {isPurchased ? 'مملوك' : 'شراء'}
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
          className="p-4 bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-lg border border-yellow-400/30 rounded-xl text-center shadow-lg"
        >
          <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2 animate-pulse" />
          <h2 className="text-sm font-bold text-white mb-1">
            مزايا البريميوم
          </h2>
          <p className="text-gray-300 text-xs">
            افتح التعدين الأسرع والميزات الحصرية مع خطط الاشتراك
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StorePage;
