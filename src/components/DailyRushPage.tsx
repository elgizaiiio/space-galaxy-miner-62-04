
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useSpaceCoins } from '../hooks/useSpaceCoins';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { dailyRushService } from '../services/dailyRushService';
import { TON_PAYMENT_ADDRESS } from '../utils/ton';
import type { DailyRushEvent, UserDailyProgress, SurpriseBonus } from '../types/dailyRush';
import { Crown, Clock, Gift, Zap, Star, Trophy, Users, Info, Sparkles, Coins, Ticket } from 'lucide-react';

const DailyRushPage = () => {
  const [event, setEvent] = useState<DailyRushEvent>(dailyRushService.getCurrentEvent());
  const [userProgress, setUserProgress] = useState<UserDailyProgress>(dailyRushService.getUserProgress('current_user'));
  const [timeRemaining, setTimeRemaining] = useState(dailyRushService.getTimeRemaining());
  const [showSurpriseBonus, setShowSurpriseBonus] = useState<SurpriseBonus | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    spaceCoins,
    addCoins
  } = useSpaceCoins();
  const {
    toast
  } = useToast();
  const [tonConnectUI] = useTonConnectUI();
  const theme = dailyRushService.getTheme(event.theme);

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = dailyRushService.getTimeRemaining();
      setTimeRemaining(remaining);

      // Check if event expired
      if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        // Reset event
        setEvent(dailyRushService.getCurrentEvent());
        setUserProgress(dailyRushService.getUserProgress('current_user'));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaimTicket = async (ticketNumber: number) => {
    if (isProcessing) return;
    const ticket = event.tickets.find(t => t.number === ticketNumber);
    if (!ticket) return;
    setIsProcessing(true);
    try {
      // Handle payment for paid tickets
      if (ticket.type === 'paid' && ticket.cost) {
        if (!tonConnectUI.wallet) {
          toast({
            title: 'Connect Wallet',
            description: 'Please connect your TON wallet to purchase tickets',
            variant: 'destructive'
          });
          await tonConnectUI.openModal();
          setIsProcessing(false);
          return;
        }

        // Create payment transaction
        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 300,
          messages: [{
            address: TON_PAYMENT_ADDRESS,
            amount: (ticket.cost * 1e9).toString()
          }]
        };
        await tonConnectUI.sendTransaction(transaction);
        toast({
          title: 'Payment Successful',
          description: `${ticket.cost} TON sent successfully`
        });
      }

      // Claim the ticket
      const result = dailyRushService.claimTicket(ticketNumber);
      if (result.success) {
        // Update state
        setEvent(dailyRushService.getCurrentEvent());
        setUserProgress(dailyRushService.getUserProgress('current_user'));

        // Add SPACE tokens
        addCoins(ticket.reward);
        toast({
          title: 'Ticket Claimed!',
          description: result.message
        });

        // Show surprise bonus if any
        if (result.surpriseBonus) {
          setShowSurpriseBonus(result.surpriseBonus);

          // Apply surprise bonus
          if (result.surpriseBonus.type === 'space_tokens') {
            addCoins(result.surpriseBonus.value);
          }
        }
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error claiming ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to claim ticket',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!tonConnectUI.wallet) {
      toast({
        title: 'Connect Wallet',
        description: 'Please connect your TON wallet to claim the reward',
        variant: 'destructive'
      });
      await tonConnectUI.openModal();
      return;
    }

    try {
      // Create payment transaction
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{
          address: TON_PAYMENT_ADDRESS,
          amount: (2 * 1e9).toString()
        }]
      };
      await tonConnectUI.sendTransaction(transaction);
      toast({
        title: 'Payment Successful',
        description: '2 TON sent successfully. Your 1000 TON reward will be processed shortly!'
      });
      setShowCongratulations(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to process payment',
        variant: 'destructive'
      });
    }
  };

  const renderTicketGrid = () => {
    const startIndex = Math.max(0, userProgress.currentTicket - 6);
    const endIndex = Math.min(event.tickets.length, userProgress.currentTicket + 9);
    const visibleTickets = event.tickets.slice(startIndex, endIndex);

    return (
      <div className="space-y-3">
        {/* Compact Progress Overview */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-3 border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-white font-medium text-sm">Progress</span>
            </div>
            <div className="text-yellow-400 text-sm font-bold">
              {userProgress.ticketsClaimed.length}/{event.tickets.length}
            </div>
          </div>
          
          <Progress value={dailyRushService.getProgressPercentage()} className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden mb-2" />
          
          <p className="text-center text-yellow-300 font-medium text-xs">
            {dailyRushService.getMotivationalMessage()}
          </p>
        </div>

        {/* Compact Current Section Header */}
        <div className="text-center">
          <h3 className="text-base font-bold text-white mb-1 flex items-center justify-center gap-2">
            <Ticket className="w-4 h-4 text-blue-400" />
            Active Tickets
          </h3>
          <div className="text-gray-400 text-xs bg-black/20 rounded px-2 py-0.5 inline-block">
            Showing {startIndex + 1} - {endIndex}
          </div>
        </div>

        {/* Compact Ticket Grid */}
        <div className="grid grid-cols-4 gap-2 mx-2">
          {visibleTickets.map((ticket, index) => {
            const isClaimed = ticket.claimed;
            const isUnlocked = ticket.unlocked;
            const isCurrent = ticket.number === userProgress.currentTicket;
            const isSpecial = [25, 40, 50].includes(ticket.number);

            return (
              <motion.div 
                key={ticket.number} 
                initial={{ scale: 0.8, opacity: 0, y: 10 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.02 }}
                className={`relative group ${isClaimed ? 'opacity-80' : isUnlocked ? 'opacity-100' : 'opacity-50'}`}
              >
                <motion.div 
                  whileHover={isUnlocked && !isClaimed ? { scale: 1.02, y: -1 } : {}} 
                  whileTap={isUnlocked && !isClaimed ? { scale: 0.98 } : {}}
                  className={`relative aspect-square cursor-pointer transition-all duration-200 ${isCurrent ? 'ring-1 ring-yellow-400 ring-offset-1 ring-offset-black' : ''}`} 
                  onClick={() => isUnlocked && !isClaimed && handleClaimTicket(ticket.number)}
                >
                  <Card className={`h-full w-full relative overflow-hidden transition-all duration-200 ${
                    isClaimed 
                      ? 'bg-gradient-to-br from-green-600/30 to-green-800/30 border-green-400/50' 
                      : isUnlocked 
                        ? isSpecial 
                          ? 'bg-gradient-to-br from-yellow-500/30 to-orange-600/30 border-yellow-400/50' 
                          : 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-blue-400/50' 
                        : 'bg-gradient-to-br from-gray-700/30 to-gray-900/30 border-gray-500/30'
                  }`}>
                    <CardContent className="p-1.5 h-full flex flex-col items-center justify-center relative">
                      {/* Ticket Content */}
                      {isClaimed ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg">
                          ✅
                        </motion.div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img 
                            src="/lovable-uploads/eaa0be57-0436-47a4-9d76-025c98468ebc.png" 
                            alt="Space Ticket" 
                            className="w-8 h-8 object-contain" 
                          />
                          {isSpecial && isUnlocked && (
                            <motion.div 
                              animate={{ rotate: 360 }} 
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="absolute -top-0.5 -right-0.5"
                            >
                              <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                            </motion.div>
                          )}
                        </div>
                      )}

                      {/* Ticket Number */}
                      <div className={`absolute bottom-0 left-0 right-0 text-xs font-bold text-center py-0.5 ${
                        isClaimed 
                          ? 'bg-green-600/90 text-white' 
                          : isSpecial && isUnlocked 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' 
                            : 'bg-black/80 text-white'
                      }`}>
                        #{ticket.number}
                      </div>

                      {/* Cost Badge */}
                      {ticket.type === 'paid' && !isClaimed && isUnlocked && (
                        <motion.div 
                          initial={{ scale: 0 }} 
                          animate={{ scale: 1 }}
                          className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-1 py-0.5 rounded-bl font-bold"
                        >
                          {ticket.cost} TON
                        </motion.div>
                      )}

                      {/* Hover Reward Preview */}
                      {isUnlocked && !isClaimed && (
                        <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-center">
                          <div className="flex items-center gap-1 mb-1">
                            <Coins className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-400 text-xs font-bold">
                              +{ticket.reward.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-white text-xs">$SPACE</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const SurpriseBonusModal = () => (
    <AnimatePresence>
      {showSurpriseBonus && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={() => setShowSurpriseBonus(null)}
        >
          <motion.div 
            initial={{ scale: 0.5, rotate: -10 }} 
            animate={{ scale: 1, rotate: 0 }} 
            exit={{ scale: 0.5, rotate: 10 }}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl" 
            onClick={e => e.stopPropagation()}
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-6xl mb-4"
            >
              {showSurpriseBonus.emoji}
            </motion.div>
            <h3 className="text-2xl font-bold text-black mb-2">Surprise Bonus!</h3>
            <p className="text-black/80 mb-4">{showSurpriseBonus.message}</p>
            <Button onClick={() => setShowSurpriseBonus(null)} className="bg-black text-white hover:bg-gray-800">
              Awesome!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen p-3 pb-20 relative overflow-hidden" style={{
      backgroundImage: `linear-gradient(135deg, ${theme.backgroundGradient.replace('from-', '').replace('via-', ', ').replace('to-', ', ')})`
    }}>
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-sm mx-auto relative z-10">
        {/* Compact Header */}
        <div className="text-center mb-3">
          <p className="text-gray-300 text-xs">Collect tickets • Win prizes • Earn TON!</p>
        </div>

        {/* Compact Top Bar: Prize + Countdown */}
        <Card className="mb-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-400/20 p-1.5 rounded-lg">
                  <Crown className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <div className="text-yellow-400 text-xs font-semibold">Today's Prize</div>
                  <div className="text-white text-base font-bold">{event.prize}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-orange-400 text-xs mb-1">
                  <Clock className="w-3 h-3" />
                  <span>Time Left</span>
                </div>
                <div className="text-white font-mono text-sm bg-black/30 px-2 py-1 rounded">
                  {String(timeRemaining.hours).padStart(2, '0')}:
                  {String(timeRemaining.minutes).padStart(2, '0')}:
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Current Ticket Action */}
        <Card className="mb-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 backdrop-blur-sm">
          <CardContent className="p-3">
            {(() => {
              const currentTicket = event.tickets.find(t => t.number === userProgress.currentTicket);
              if (!currentTicket) return null;
              return (
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }} 
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <img 
                        src="/lovable-uploads/eaa0be57-0436-47a4-9d76-025c98468ebc.png" 
                        alt="Space Ticket" 
                        className="w-12 h-12 object-contain" 
                      />
                    </motion.div>
                  </div>
                  <h3 className="text-white text-base font-bold mb-2">
                    Ticket #{currentTicket.number}
                  </h3>
                  
                  {/* Compact Reward Display */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded">
                      <span className="text-yellow-400 font-bold text-sm">
                        +{currentTicket.reward.toLocaleString()}
                      </span>
                      <span className="text-yellow-300 text-xs">$SPACE</span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded">
                      <Ticket className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-400 font-bold text-sm">+1</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleClaimTicket(currentTicket.number)} 
                    disabled={isProcessing || currentTicket.claimed} 
                    className={`w-full py-2 font-bold text-sm ${
                      currentTicket.type === 'free' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                    } shadow-lg`}
                  >
                    {isProcessing 
                      ? 'Processing...' 
                      : currentTicket.claimed 
                        ? 'Claimed ✅' 
                        : currentTicket.type === 'free' 
                          ? 'Get Free Ticket' 
                          : `Buy Ticket (${currentTicket.cost} TON)`
                    }
                  </Button>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Compact Ticket Collection */}
        <Card className="mb-3 bg-black/20 border-white/20 backdrop-blur-sm">
          <CardContent className="p-3">
            {renderTicketGrid()}
          </CardContent>
        </Card>

        {/* Special 100K User Event Button */}
        <div className="text-center">
          <Button
            onClick={() => setShowCongratulations(true)}
            className="bg-gradient-to-r from-yellow-500 to-gold-600 hover:from-yellow-600 hover:to-gold-700 text-black font-bold py-3 px-6 rounded-lg shadow-lg border-2 border-yellow-400/60"
          >
            <Crown className="w-5 h-5 mr-2" />
            Why Did I Win? 🎉
          </Button>
        </div>
      </div>

      {/* Congratulations Modal */}
      <Dialog open={showCongratulations} onOpenChange={setShowCongratulations}>
        <DialogContent className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 border-2 border-gold-400 text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold text-gold-400 mb-2">
              🎉 Congratulations! You Are Our 100,000th User! 🎉
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 text-center text-sm">
            <p className="text-gray-300">
              You've just unlocked a milestone achievement — you're officially our 100,000th user! 
              To celebrate this special moment, we've reserved a reward of 1,000 TON just for you! 🚀💎
            </p>
            
            <p className="text-gray-300">
              This isn't just luck — it's our way of saying thank you for being part of our amazing journey. 🙌
            </p>

            <div className="bg-yellow-900/40 rounded-lg p-3 border border-yellow-400/30">
              <p className="text-yellow-200 text-xs">
                🕒 Your reward is reserved in your name for the next 24 hours only!
              </p>
            </div>

            <p className="text-gray-300 text-xs">
              To activate and withdraw your 1,000 TON prize, a small processing fee of 2 TON is required 
              to verify your wallet and secure the transfer.
            </p>

            <div className="bg-blue-900/40 rounded-lg p-2 border border-blue-400/30">
              <p className="text-blue-200 text-xs">
                💼 This small step helps us keep the platform fair, secure, and fully automated.
                We use it to confirm genuine wallet activity and protect against bots and abuse.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Button 
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 text-sm"
              >
                💳 Pay 2 TON & Claim 1,000 TON
              </Button>
              
              <Button 
                onClick={() => setShowCongratulations(false)}
                variant="outline"
                className="w-full border-gray-400 text-gray-300 hover:bg-gray-800 text-sm py-2"
              >
                Maybe Later
              </Button>
            </div>

            <div className="text-xs text-gray-400 pt-1">
              <p>🔐 Secure • 🌟 Trusted • ⚡ Blockchain-powered</p>
              <p className="mt-1">With excitement, The Space AI Team</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SurpriseBonusModal />
    </div>
  );
};

export default DailyRushPage;
