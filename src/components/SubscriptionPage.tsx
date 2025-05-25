
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, CheckCircle, Rocket, Settings } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { getStoredLanguage, getTranslation } from '../utils/language';
import { formatTON } from '../utils/ton';

const SubscriptionPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(getStoredLanguage());
  const [currentPlan, setCurrentPlan] = useState('free');

  const t = (key: string) => getTranslation(key, currentLanguage.code);

  const plans = [
    {
      id: 'free',
      name: t('freePlan') || 'Free',
      price: 0,
      period: t('forever') || 'Forever',
      icon: Star,
      color: 'gray',
      features: [
        t('basicMining') || 'Basic mining',
        t('standardSpeed') || 'Standard speed (1x)',
        t('basicTasks') || 'Basic tasks',
        t('communitySupport') || 'Community support'
      ]
    },
    {
      id: 'premium',
      name: t('premiumPlan') || 'Premium',
      price: 0.5,
      period: t('perMonth') || 'per month',
      icon: Crown,
      color: 'yellow',
      popular: true,
      features: [
        t('autoMining') || 'Auto mining',
        t('fastSpeed') || 'Fast speed (5x)',
        t('premiumTasks') || 'Premium tasks',
        t('backgroundChange') || 'Background customization',
        t('prioritySupport') || 'Priority support',
        t('earlyAccess') || 'Early access to features'
      ]
    },
    {
      id: 'vip',
      name: t('vipPlan') || 'VIP',
      price: 1.0,
      period: t('perMonth') || 'per month',
      icon: Rocket,
      color: 'purple',
      features: [
        t('ultraFastMining') || 'Ultra-fast mining (10x)',
        t('unlimitedAutoMining') || 'Unlimited auto mining',
        t('exclusiveTasks') || 'Exclusive VIP tasks',
        t('customBackgrounds') || 'Custom backgrounds',
        t('vipSupport') || '24/7 VIP support',
        t('specialRewards') || 'Special rewards & bonuses',
        t('exclusiveFeatures') || 'Exclusive features'
      ]
    }
  ];

  const handleSubscribe = (planId: string, price: number) => {
    if (price === 0) {
      setCurrentPlan(planId);
      return;
    }
    
    // Here you would integrate with TON payment
    console.log(`Subscribing to ${planId} plan for ${formatTON(price)}`);
    // For now, just simulate subscription
    setCurrentPlan(planId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 p-4 pb-24">
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
              {t('subscriptions') || 'Subscriptions'}
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">
              {t('unlockPremiumFeatures') || 'Unlock premium features and boost your mining'}
            </p>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan === plan.id;
            
            return (
              <Card
                key={plan.id}
                className={`relative bg-gradient-to-br backdrop-blur-xl border-2 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                    : plan.color === 'purple'
                    ? 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
                    : 'from-gray-500/10 to-gray-600/10 border-gray-500/30'
                } ${
                  isCurrentPlan ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-500 text-black font-bold">
                      {t('popular') || 'Popular'}
                    </Badge>
                  </div>
                )}
                
                {isCurrentPlan && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white font-bold">
                      {t('current') || 'Current'}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${
                      plan.color === 'yellow' ? 'bg-yellow-500/20' :
                      plan.color === 'purple' ? 'bg-purple-500/20' : 'bg-gray-500/20'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        plan.color === 'yellow' ? 'text-yellow-400' :
                        plan.color === 'purple' ? 'text-purple-400' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                  <CardTitle className="text-white text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-white">
                      {plan.price === 0 ? t('free') || 'Free' : formatTON(plan.price)}
                    </span>
                    <span className="text-gray-300 text-sm ml-2">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSubscribe(plan.id, plan.price)}
                    disabled={isCurrentPlan}
                    className={`w-full mt-6 ${
                      isCurrentPlan
                        ? 'bg-green-600 hover:bg-green-600 cursor-default'
                        : plan.popular
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
                        : plan.color === 'purple'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                    } rounded-2xl font-bold py-3`}
                  >
                    {isCurrentPlan
                      ? t('currentPlan') || 'Current Plan'
                      : plan.price === 0
                      ? t('selectPlan') || 'Select Plan'
                      : t('subscribe') || 'Subscribe'
                    }
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-2 border-indigo-500/30 rounded-3xl overflow-hidden mt-8">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center flex items-center justify-center gap-2">
              <Settings className="w-6 h-6" />
              {t('featureComparison') || 'Feature Comparison'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <h3 className="text-white font-bold">{t('miningSpeed') || 'Mining Speed'}</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <div>Free: 1x</div>
                  <div>Premium: 5x</div>
                  <div>VIP: 10x</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold">{t('autoMining') || 'Auto Mining'}</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <div>Free: ❌</div>
                  <div>Premium: ✅</div>
                  <div>VIP: ✅ Unlimited</div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold">{t('customization') || 'Customization'}</h3>
                <div className="text-gray-300 text-sm space-y-1">
                  <div>Free: ❌</div>
                  <div>Premium: ✅ Basic</div>
                  <div>VIP: ✅ Advanced</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;
