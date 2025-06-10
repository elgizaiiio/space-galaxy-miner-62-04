
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
        'خلفيات أساسية',
        'دعم أولوية'
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
        'شارة VIP',
        'مهام حصرية',
        'دعم 24/7'
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
        'شارة النخبة',
        'مهام VIP فقط',
        'مدير شخصي',
        'وصول مبكر للميزات'
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
      className="min-h-screen p-3 pb-24 relative"
      style={{
        backgroundImage: `url(/lovable-uploads/a61fe220-a4a1-4863-bf49-f46aaea61a74.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="max-w-md mx-auto space-y-4 relative z-10">
        <div className="text-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center mb-3"
          >
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
          >
            متجر TON
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-2 bg-gradient-to-br from-slate-800/60 to-blue-900/50 backdrop-blur-xl border border-blue-400/30 rounded-xl p-3 shadow-lg"
          >
            <Coins className="w-5 h-5 text-blue-400" />
            <span className="text-white font-bold text-lg">{formatTON(tonBalance)}</span>
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl font-bold text-white flex items-center gap-2"
          >
            <Crown className="w-6 h-6 text-yellow-400" />
            اشتراكات بريميوم
          </motion.h2>
          
          {subscriptions.map((sub, index) => {
            const Icon = sub.icon;
            const isPurchased = purchasedItems.includes(sub.id);
            
            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                {sub.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10 bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold">
                    الأكثر شعبية
                  </Badge>
                )}
                
                <Card className={`bg-gradient-to-br from-slate-800/50 via-blue-900/40 to-purple-900/50 backdrop-blur-xl border ${sub.popular ? 'border-yellow-400/50' : 'border-blue-400/30'} rounded-2xl shadow-2xl ${sub.popular ? 'ring-2 ring-yellow-400/40' : ''}`}>
                  <CardHeader className="text-center pb-3">
                    <div className="flex justify-center mb-3">
                      <div className={`p-4 rounded-full bg-gradient-to-r ${sub.color} shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl font-bold">
                      {sub.name}
                    </CardTitle>
                    <p className="text-gray-300 text-sm">{sub.description}</p>
                    <div className="text-center mt-3">
                      <span className="text-3xl font-bold text-white">
                        {formatTON(sub.price)}
                      </span>
                      <span className="text-sm ml-2 text-gray-300 font-bold">
                        / {sub.duration}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {sub.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
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
                      } rounded-xl font-bold py-3 text-sm shadow-lg transition-all duration-300`}
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

        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-xl font-bold text-white flex items-center gap-2"
          >
            <Zap className="w-6 h-6 text-yellow-400" />
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
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-br from-slate-800/50 via-blue-900/40 to-purple-900/50 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${upgrade.color} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {upgrade.name}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {upgrade.description}
                      </p>
                    </div>
                  </div>
                  {isPurchased && (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-lg">
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
                    {isPurchased ? 'مملوك' : 'شراء'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="p-6 bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-xl border border-yellow-400/30 rounded-2xl text-center shadow-2xl"
        >
          <Star className="w-10 h-10 text-yellow-400 mx-auto mb-3 animate-pulse" />
          <h2 className="text-lg font-bold text-white mb-2">
            مزايا البريميوم
          </h2>
          <p className="text-gray-300 text-sm">
            افتح التعدين الأسرع والميزات الحصرية والدعم المميز مع خطط الاشتراك لدينا
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StorePage;
