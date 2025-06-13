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
import { Crown, Clock, Gift, Zap, Star, Trophy, Users, Info, Sparkles } from 'lucide-react';
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
    const visibleTickets = event.tickets.slice(Math.max(0, userProgress.currentTicket - 5), userProgress.currentTicket + 10);
    return <div className="grid grid-cols-5 gap-2 mb-6">
        {visibleTickets.map(ticket => {
        const isClaimed = ticket.claimed;
        const isUnlocked = ticket.unlocked;
        const isCurrent = ticket.number === userProgress.currentTicket;
        return <motion.div key={ticket.number} initial={{
          scale: 0.8,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} className={`relative aspect-square ${isClaimed ? 'opacity-50' : isUnlocked ? isCurrent ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-black' : '' : 'opacity-30'}`}>
              <Card className={`h-full w-full cursor-pointer transition-all duration-200 ${isClaimed ? 'bg-green-600/30 border-green-400/50' : isUnlocked ? `bg-gradient-to-br ${theme.primaryColor} border-white/30 hover:scale-105` : 'bg-gray-600/30 border-gray-500/50'}`} onClick={() => isUnlocked && !isClaimed && handleClaimTicket(ticket.number)}>
                <CardContent className="p-1 h-full flex flex-col items-center justify-center">
                  <div className="text-lg">{isClaimed ? '✅' : theme.ticketIcon}</div>
                  <div className="text-xs font-bold text-white">{ticket.number}</div>
                  {ticket.type === 'paid' && !isClaimed && <div className="text-xs text-yellow-400">{ticket.cost} TON</div>}
                </CardContent>
              </Card>
            </motion.div>;
      })}
      </div>;
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
  return <div className="min-h-screen p-4 pb-24 relative overflow-hidden" style={{
    backgroundImage: `linear-gradient(135deg, ${theme.backgroundGradient.replace('from-', '').replace('via-', ', ').replace('to-', ', ')})`
  }}>
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1 initial={{
          y: -20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent mb-2">
            {theme.emoji} Daily Rush {theme.emoji}
          </motion.h1>
          <p className="text-gray-300 text-sm">Collect tickets, win prizes, earn TON!</p>
        </div>

        {/* Top Bar: Prize + Countdown */}
        <Card className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <div>
                  <div className="text-yellow-400 text-sm font-semibold">Today's Prize</div>
                  <div className="text-white text-lg font-bold">{event.prize}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-orange-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Time Left</span>
                </div>
                <div className="text-white font-mono text-lg">
                  {String(timeRemaining.hours).padStart(2, '0')}:
                  {String(timeRemaining.minutes).padStart(2, '0')}:
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className="mb-6 bg-black/40 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Progress</span>
              <span className="text-gray-300 text-sm">{event.currentStep}/{event.totalSteps}</span>
            </div>
            <Progress value={dailyRushService.getProgressPercentage()} className="mb-3" />
            <div className="text-center">
              <p className="text-yellow-400 text-sm font-medium">
                {dailyRushService.getMotivationalMessage()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Ticket Action */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30">
          <CardContent className="p-4">
            {(() => {
            const currentTicket = event.tickets.find(t => t.number === userProgress.currentTicket);
            if (!currentTicket) return null;
            return <div className="text-center">
                  <div className="text-4xl mb-2">{theme.ticketIcon}</div>
                  <h3 className="text-white text-lg font-bold mb-2">
                    Ticket #{currentTicket.number}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Reward: {currentTicket.reward.toLocaleString()} $SPACE
                  </p>
                  
                  <Button onClick={() => handleClaimTicket(currentTicket.number)} disabled={isProcessing || currentTicket.claimed} className={`w-full ${currentTicket.type === 'free' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                    {isProcessing ? 'Processing...' : currentTicket.claimed ? 'Claimed ✅' : currentTicket.type === 'free' ? 'Get Free Ticket' : `Buy Ticket (${currentTicket.cost} TON)`}
                  </Button>
                </div>;
          })()}
          </CardContent>
        </Card>

        {/* Ticket Grid */}
        <Card className="mb-6 bg-black/40 border-white/20">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-4 text-center">Ticket Collection</h3>
            {renderTicketGrid()}
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        
      </div>

      <SurpriseBonusModal />
    </div>;
};
export default DailyRushPage;