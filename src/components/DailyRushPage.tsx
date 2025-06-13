import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showRules, setShowRules] = useState(false);
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
  const renderTicketGrid = () => {
    const startIndex = Math.max(0, userProgress.currentTicket - 6);
    const endIndex = Math.min(event.tickets.length, userProgress.currentTicket + 9);
    const visibleTickets = event.tickets.slice(startIndex, endIndex);
    
    return (
      <div className="space-y-4">
        {/* Enhanced Progress Overview */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-purple-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold text-sm">Progress</span>
            </div>
            <div className="text-yellow-400 text-sm font-bold">
              {userProgress.ticketsClaimed.length}/{event.tickets.length}
            </div>
          </div>
          
          <div className="relative mb-3">
            <Progress 
              value={dailyRushService.getProgressPercentage()} 
              className="h-2 bg-gray-800/50 rounded-full overflow-hidden"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full opacity-30 animate-pulse"></div>
          </div>
          
          <p className="text-center text-yellow-300 font-medium text-xs">
            {dailyRushService.getMotivationalMessage()}
          </p>
        </div>

        {/* Current Section Header */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center justify-center gap-2">
            <Ticket className="w-5 h-5 text-blue-400" />
            Active Tickets
          </h3>
          <div className="text-gray-400 text-xs bg-black/20 rounded-lg px-3 py-1 inline-block">
            Showing tickets {startIndex + 1} - {endIndex}
          </div>
        </div>

        {/* Mobile-Optimized Ticket Grid - 3 columns for better mobile view */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {visibleTickets.map((ticket, index) => {
            const isClaimed = ticket.claimed;
            const isUnlocked = ticket.unlocked;
            const isCurrent = ticket.number === userProgress.currentTicket;
            const isSpecial = [25, 40, 50].includes(ticket.number);
            
            return (
              <motion.div
                key={ticket.number}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`relative group ${
                  isClaimed ? 'opacity-80' : isUnlocked ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <motion.div
                  whileHover={isUnlocked && !isClaimed ? { scale: 1.02, y: -1 } : {}}
                  whileTap={isUnlocked && !isClaimed ? { scale: 0.98 } : {}}
                  className={`relative aspect-square cursor-pointer transition-all duration-300 ${
                    isCurrent ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-black' : ''
                  }`}
                  onClick={() => isUnlocked && !isClaimed && handleClaimTicket(ticket.number)}
                >
                  <Card className={`h-full w-full relative overflow-hidden transition-all duration-300 ${
                    isClaimed
                      ? 'bg-gradient-to-br from-green-600/40 to-green-800/40 border-green-400/60'
                      : isUnlocked
                      ? isSpecial
                        ? 'bg-gradient-to-br from-yellow-500/40 to-orange-600/40 border-yellow-400/60 shadow-lg shadow-yellow-400/20'
                        : 'bg-gradient-to-br from-blue-600/40 to-purple-600/40 border-blue-400/60'
                      : 'bg-gradient-to-br from-gray-700/40 to-gray-900/40 border-gray-500/40'
                  }`}>
                    <CardContent className="p-2 h-full flex flex-col items-center justify-center relative">
                      {/* Background Effects */}
                      {isSpecial && !isClaimed && (
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 animate-pulse"></div>
                      )}
                      
                      {/* Ticket Content */}
                      {isClaimed ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-2xl"
                        >
                          ✅
                        </motion.div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            src="/lovable-uploads/eaa0be57-0436-47a4-9d76-025c98468ebc.png"
                            alt="Space Ticket"
                            className={`w-8 h-8 sm:w-10 sm:h-10 object-contain transition-all duration-300 ${
                              isUnlocked ? 'brightness-100' : 'brightness-50'
                            }`}
                          />
                          {isSpecial && isUnlocked && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="absolute -top-1 -right-1"
                            >
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
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
                        {isSpecial && <div className="text-xs opacity-75">MEGA</div>}
                      </div>

                      {/* Cost Badge */}
                      {ticket.type === 'paid' && !isClaimed && isUnlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-1 py-0.5 rounded-bl font-bold shadow-lg"
                        >
                          {ticket.cost} TON
                        </motion.div>
                      )}

                      {/* Mobile-Optimized Reward Preview */}
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

        {/* Navigation Hint for Mobile */}
        {event.tickets.length > 15 && (
          <div className="text-center">
            <p className="text-gray-400 text-xs">
              Swipe or complete tickets to see more
            </p>
          </div>
        )}
      </div>
    );
  };
  const SurpriseBonusModal = () => <AnimatePresence>
      {showSurpriseBonus && <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSurpriseBonus(null)}>
          <motion.div initial={{
        scale: 0.5,
        rotate: -10
      }} animate={{
        scale: 1,
        rotate: 0
      }} exit={{
        scale: 0.5,
        rotate: 10
      }} className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <motion.div animate={{
          rotate: [0, 10, -10, 0]
        }} transition={{
          duration: 0.5,
          repeat: 2
        }} className="text-6xl mb-4">
              {showSurpriseBonus.emoji}
            </motion.div>
            <h3 className="text-2xl font-bold text-black mb-2">Surprise Bonus!</h3>
            <p className="text-black/80 mb-4">{showSurpriseBonus.message}</p>
            <Button onClick={() => setShowSurpriseBonus(null)} className="bg-black text-white hover:bg-gray-800">
              Awesome!
            </Button>
          </motion.div>
        </motion.div>}
    </AnimatePresence>;
  return (
    <div 
      className="min-h-screen p-3 pb-20 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, ${theme.backgroundGradient.replace('from-', '').replace('via-', ', ').replace('to-', ', ')})`
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="max-w-sm mx-auto relative z-10">
        {/* Enhanced Mobile Header */}
        <div className="text-center mb-4">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent mb-1"
          >
            {theme.emoji} Daily Rush {theme.emoji}
          </motion.h1>
          <p className="text-gray-300 text-xs">Collect tickets • Win prizes • Earn TON!</p>
        </div>

        {/* Enhanced Top Bar: Prize + Countdown */}
        <Card className="mb-4 bg-gradient-to-r from-yellow-500/25 to-orange-500/25 border-yellow-400/40 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-yellow-400/20 p-2 rounded-lg">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-yellow-400 text-xs font-semibold">Today's Prize</div>
                  <div className="text-white text-lg font-bold">{event.prize}</div>
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

        {/* Enhanced Current Ticket Action */}
        <Card className="mb-4 bg-gradient-to-r from-blue-500/25 to-purple-500/25 border-blue-400/40 backdrop-blur-sm">
          <CardContent className="p-4">
            {(() => {
              const currentTicket = event.tickets.find(t => t.number === userProgress.currentTicket);
              if (!currentTicket) return null;
              
              return (
                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <img
                        src="/lovable-uploads/eaa0be57-0436-47a4-9d76-025c98468ebc.png"
                        alt="Space Ticket"
                        className="w-16 h-16 object-contain"
                      />
                    </motion.div>
                  </div>
                  <h3 className="text-white text-lg font-bold mb-2">
                    Ticket #{currentTicket.number}
                  </h3>
                  
                  {/* Enhanced Reward Display */}
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-lg">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold text-sm">
                        +{currentTicket.reward.toLocaleString()}
                      </span>
                      <span className="text-yellow-300 text-xs">$SPACE</span>
                    </div>
                    <div className="flex items-center gap-1 bg-blue-500/20 px-3 py-1 rounded-lg">
                      <Ticket className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-bold text-sm">+1</span>
                      <span className="text-blue-300 text-xs">Ticket</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleClaimTicket(currentTicket.number)}
                    disabled={isProcessing || currentTicket.claimed}
                    className={`w-full py-3 font-bold text-sm ${
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

        {/* Enhanced Ticket Collection */}
        <Card className="mb-4 bg-black/30 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4">
            {renderTicketGrid()}
          </CardContent>
        </Card>

        {/* Mobile-Optimized Bottom Navigation */}
        <div className="fixed bottom-16 left-0 right-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-lg border-t border-purple-400/30 p-2 z-40">
          <div className="max-w-sm mx-auto">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex flex-col items-center gap-1 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowRules(!showRules)}
                className="flex flex-col items-center gap-1 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Info className="w-4 h-4" />
                <span>Rules</span>
              </Button>
              <Button
                variant="ghost"
                className="flex flex-col items-center gap-1 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Users className="w-4 h-4" />
                <span>Invite</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SurpriseBonusModal />
    </div>
  );
};

export default DailyRushPage;
