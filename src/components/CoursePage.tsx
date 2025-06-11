import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';
import { TON_PAYMENT_ADDRESS } from '@/utils/ton';

const CoursePage = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();

  const features = [
    'Make Money Online',
    'Improve Your Mindset', 
    'Social Skills & Confidence',
    'Business & Time Management'
  ];

  const handleJoinCourse = async () => {
    try {
      console.log('Starting course purchase process...');
      
      if (!tonConnectUI.wallet) {
        console.log('No wallet connected, opening modal...');
        await tonConnectUI.openModal();
        toast({
          title: 'Connect Wallet',
          description: 'Please connect your wallet to purchase the course'
        });
        return;
      }

      console.log('Wallet connected, preparing transaction...');
      
      const tonAmount = 4.5;
      const nanoTonAmount = (tonAmount * 1e9).toString();
      
      console.log(`Creating transaction: ${tonAmount} TON (${nanoTonAmount} nanoTON)`);

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: TON_PAYMENT_ADDRESS,
            amount: nanoTonAmount,
            payload: btoa('Millionaire Course Purchase - $15'),
          },
        ],
      };

      console.log('Transaction details:', transaction);
      
      const result = await tonConnectUI.sendTransaction(transaction);
      console.log('Transaction sent successfully:', result);
      
      toast({
        title: 'Payment Successful!',
        description: 'Welcome to the Millionaire course! Check your email for access details.',
      });

    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: "destructive"
      });
    }
  };

  return (
    <div 
      className="min-h-screen p-4 relative"
      style={{
        backgroundImage: `url('/lovable-uploads/8d6c6b4d-d501-4cd4-ae0c-48202028cc66.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8"
        >
          <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600">
              <h1 className="text-2xl font-bold text-white mb-1">Become a Millionaire</h1>
              <p className="text-blue-100 text-xs">Transform your life with our proven system</p>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              {/* 72-Hour Discount Alert */}
              <div className="mt-4 mb-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span className="text-red-800 font-bold text-sm">72-Hour Flash Sale!</span>
                  </div>
                  <p className="text-red-700 text-xs font-medium">Save $135!</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-lg font-bold text-red-600 line-through">$150</span>
                    <span className="text-2xl font-bold text-green-600">$15</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-center mb-4">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-3">
                  <p className="text-xs text-gray-600 mb-1">Special Price</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-gray-900">$15</span>
                    <div className="text-xs text-gray-500">
                      <p>≈ 4.5 TON</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 font-medium">90% OFF!</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mb-4">
                <Button 
                  onClick={handleJoinCourse}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl text-base transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Join Now & Start Earning
                </Button>
              </div>

              {/* Question */}
              <p className="text-gray-700 text-center text-sm mb-4 font-medium">
                Are you ready to become a millionaire?
              </p>

              {/* Features */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-900 mb-3 text-center">What You'll Learn:</h3>
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-2 bg-gray-50 rounded-xl p-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-800 font-medium text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CoursePage;
