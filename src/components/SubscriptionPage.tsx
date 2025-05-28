import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, CheckCircle, Rocket, Settings } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';
import LanguageSwitcher from './LanguageSwitcher';
import { getStoredLanguage, getTranslation } from '../utils/language';
import { formatTON } from '../utils/ton';
const SubscriptionPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [currentPlan, setCurrentPlan] = useState('free');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tonConnectUI] = useTonConnectUI();
  const {
    toast
  } = useToast();
  const t = (key: string) => getTranslation(key, currentLanguage.code);
  const plans = [{
    id: 'premium',
    name: t('premiumPlan') || 'Premium',
    price: 1.5,
    period: t('perMonth') || 'per month',
    icon: Crown,
    color: 'yellow',
    popular: true,
    features: [t('autoMining') || 'Auto mining (3+ days)', t('fastSpeed') || 'Fast speed (5x)', t('bonusPoints') || '+25% bonus points on tasks', t('exclusiveBackgrounds') || 'Exclusive backgrounds', t('priorityEvents') || 'Priority access to events', t('vipBadge') || 'VIP badge on profile', t('prioritySupport') || 'Priority support']
  }, {
    id: 'vip',
    name: t('vipPlan') || 'VIP',
    price: 3.0,
    period: t('perMonth') || 'per month',
    icon: Rocket,
    color: 'purple',
    features: [t('ultraFastMining') || 'Ultra-fast mining (10x)', t('unlimitedAutoMining') || 'Unlimited auto mining', t('exclusiveTasks') || 'Exclusive VIP tasks', t('allBackgrounds') || 'All backgrounds unlocked', t('vipSupport') || '24/7 VIP support', t('specialRewards') || 'Special rewards & bonuses', t('exclusiveFeatures') || 'Exclusive features', t('earlyAccess') || 'Early access to new features']
  }];
  const handleSubscribe = async (planId: string, price: number) => {
    if (!tonConnectUI.wallet) {
      toast({
        title: t('walletRequired') || 'Wallet Required',
        description: t('connectWalletFirst') || 'Please connect your TON wallet first',
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
          amount: (price * 1e9).toString()
        }]
      };
      await tonConnectUI.sendTransaction(transaction);
      setCurrentPlan(planId);
      localStorage.setItem('premiumPlan', planId);
      localStorage.setItem('premiumExpiry', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString());
      toast({
        title: t('subscriptionSuccess') || 'Subscription Successful',
        description: t('premiumActivated') || `${planId.toUpperCase()} plan activated successfully!`
      });
    } catch (error) {
      console.error('Subscription payment failed:', error);
      toast({
        title: t('paymentFailed') || 'Payment Failed',
        description: t('subscriptionError') || 'Failed to process subscription payment',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
          <div className="relative">
            <div className="absolute top-0 right-0">
              <LanguageSwitcher onLanguageChange={() => setCurrentLanguage(getStoredLanguage())} />
            </div>
            
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full shadow-2xl animate-pulse-glow">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-3">
              {t('premium') || 'Premium'}
            </h1>
            <p className="text-base leading-relaxed text-zinc-50">
              {t('unlockPremiumFeatures') || 'Unlock premium features and boost your mining'}
            </p>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map(plan => {
          const Icon = plan.icon;
          const isCurrentPlan = currentPlan === plan.id;
          return <Card key={plan.id} className={`relative bg-gradient-to-br backdrop-blur-xl border-2 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 ${plan.popular ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50' : plan.color === 'purple' ? 'from-purple-500/20 to-pink-500/20 border-purple-500/30' : 'from-gray-500/10 to-gray-600/10 border-gray-500/30'} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
                {plan.popular && <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-black font-bold">
                      {t('popular') || 'Popular'}
                    </Badge>
                  </div>}
                
                {isCurrentPlan && <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white font-bold">
                      {t('current') || 'Current'}
                    </Badge>
                  </div>}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${plan.color === 'yellow' ? 'bg-yellow-500/20' : plan.color === 'purple' ? 'bg-purple-500/20' : 'bg-gray-500/20'}`}>
                      <Icon className={`w-8 h-8 ${plan.color === 'yellow' ? 'text-yellow-400' : plan.color === 'purple' ? 'text-purple-400' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  <CardTitle className="text-white text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-white">
                      {formatTON(plan.price)}
                    </span>
                    <span className="text-sm ml-2 text-zinc-50 font-bold">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-zinc-50 font-extrabold">{feature}</span>
                      </div>)}
                  </div>

                  <Button onClick={() => handleSubscribe(plan.id, plan.price)} disabled={isCurrentPlan || isProcessing} className={`w-full mt-6 ${isCurrentPlan ? 'bg-green-600 hover:bg-green-600 cursor-default' : plan.popular ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700' : plan.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700' : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'} rounded-2xl font-bold py-3`}>
                    {isProcessing ? t('processing') || 'Processing...' : isCurrentPlan ? t('currentPlan') || 'Current Plan' : t('subscribeNow') || 'Subscribe Now'}
                  </Button>
                </CardContent>
              </Card>;
        })}
        </div>

        {/* Premium Benefits */}
        
      </div>
    </div>;
};
export default SubscriptionPage;