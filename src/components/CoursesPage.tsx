
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Star, Users, PlayCircle } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useToast } from '@/hooks/use-toast';
import { formatTON } from '../utils/ton';

const CoursesPage = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 72, minutes: 0, seconds: 0 });

  // Countdown timer for the discount
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          return prev;
        }
        
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePurchase = async () => {
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
          amount: (4.5 * 1e9).toString(), // 4.5 TON
          payload: btoa('millionaire_course_purchase')
        }]
      };

      await tonConnectUI.sendTransaction(transaction);
      
      // Store purchase in localStorage
      localStorage.setItem('millionaireCourse', 'purchased');
      localStorage.setItem('coursePurchaseDate', Date.now().toString());

      toast({
        title: "Purchase Successful!",
        description: "Welcome to the Millionaire program. You'll get full access soon."
      });
    } catch (error) {
      console.error('Course purchase failed:', error);
      toast({
        title: "Payment Failed",
        description: "An error occurred while processing payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const courseFeatures = [
    "Make Money Online",
    "Develop the Right Mindset", 
    "Social Skills & Confidence",
    "Fitness & Masculinity",
    "Business & Time Management"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-3 pb-20">
      <div className="max-w-sm mx-auto space-y-4">
        {/* Header */}
        <div className="text-center pt-4 pb-3">
          <h1 className="text-2xl font-bold text-white mb-2">
            Become a Member
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto"></div>
        </div>

        {/* Main Course Card */}
        <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
          <CardHeader className="text-center pb-3">
            <div className="mb-3">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Millionaire
              </h2>
              
              {/* Price Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">4.5 TON</span>
                  <span className="text-gray-600 text-base">/month</span>
                </div>
                
                {/* Discount Badge */}
                <div className="flex items-center justify-center gap-2">
                  <Badge className="bg-red-500 text-white font-bold px-2 py-1 text-xs">
                    90% OFF
                  </Badge>
                  <span className="line-through text-gray-500 text-lg">45 TON</span>
                </div>
                
                {/* Countdown Timer */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>Offer ends in:</span>
                  </div>
                  <div className="text-base font-bold">
                    {timeLeft.hours.toString().padStart(2, '0')}:
                    {timeLeft.minutes.toString().padStart(2, '0')}:
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <Button 
              onClick={handlePurchase}
              disabled={isProcessing}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 text-base rounded-full mb-3"
            >
              {isProcessing ? 'Processing...' : 'Join Now'}
            </Button>

            {/* Question */}
            <p className="text-gray-700 text-base font-medium">
              Are you ready to become a millionaire?
            </p>
          </CardHeader>

          <CardContent className="space-y-3 p-4">
            {/* Course Features */}
            <div className="space-y-2">
              {courseFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0"></div>
                  <span className="text-gray-800 font-medium text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
              <div className="text-center">
                <Users className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-gray-900">10K+</div>
                <div className="text-xs text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <PlayCircle className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-gray-900">50+</div>
                <div className="text-xs text-gray-600">Videos</div>
              </div>
              <div className="text-center">
                <Star className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                <div className="text-xs font-bold text-gray-900">4.9</div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur border border-blue-500/30">
          <CardContent className="p-3 text-center">
            <div className="text-white mb-1">
              <span className="text-xs">Transaction price: </span>
              <span className="font-bold text-sm">{formatTON(4.5)}</span>
            </div>
            <p className="text-blue-200 text-xs">
              Pay using your TON wallet
            </p>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="space-y-2">
          <h3 className="text-white font-bold text-base text-center">Student Reviews</h3>
          <div className="space-y-2">
            <Card className="bg-white/10 backdrop-blur border border-white/20">
              <CardContent className="p-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-white text-xs font-bold">Ahmed M.</span>
                </div>
                <p className="text-gray-300 text-xs">
                  "Changed my life completely! Now earning over $5000 monthly"
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur border border-white/20">
              <CardContent className="p-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-white text-xs font-bold">Sarah A.</span>
                </div>
                <p className="text-gray-300 text-xs">
                  "Best course ever. Learned invaluable skills"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
