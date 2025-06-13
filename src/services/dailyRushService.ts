
import type { DailyRushEvent, DailyRushTicket, DailyRushBonus, UserDailyProgress, SurpriseBonus, DailyTheme } from '../types/dailyRush';

export class DailyRushService {
  private static instance: DailyRushService;
  private currentEvent: DailyRushEvent | null = null;
  private userProgress: UserDailyProgress | null = null;

  private themes: DailyTheme[] = [
    {
      name: 'Galaxy',
      emoji: '🌌',
      primaryColor: 'from-purple-600 to-blue-800',
      secondaryColor: 'from-purple-400 to-blue-600',
      backgroundGradient: 'from-purple-900 via-blue-900 to-indigo-900',
      ticketIcon: '🌟'
    },
    {
      name: 'Volcano',
      emoji: '🌋',
      primaryColor: 'from-red-600 to-orange-800',
      secondaryColor: 'from-red-400 to-orange-600',
      backgroundGradient: 'from-red-900 via-orange-900 to-yellow-900',
      ticketIcon: '🔥'
    },
    {
      name: 'Electric',
      emoji: '⚡',
      primaryColor: 'from-yellow-600 to-blue-800',
      secondaryColor: 'from-yellow-400 to-blue-600',
      backgroundGradient: 'from-yellow-900 via-blue-900 to-cyan-900',
      ticketIcon: '⚡'
    },
    {
      name: 'Ocean',
      emoji: '🌊',
      primaryColor: 'from-blue-600 to-teal-800',
      secondaryColor: 'from-blue-400 to-teal-600',
      backgroundGradient: 'from-blue-900 via-teal-900 to-cyan-900',
      ticketIcon: '🐚'
    },
    {
      name: 'Forest',
      emoji: '🌲',
      primaryColor: 'from-green-600 to-emerald-800',
      secondaryColor: 'from-green-400 to-emerald-600',
      backgroundGradient: 'from-green-900 via-emerald-900 to-teal-900',
      ticketIcon: '🍃'
    },
    {
      name: 'Cyber',
      emoji: '🤖',
      primaryColor: 'from-cyan-600 to-purple-800',
      secondaryColor: 'from-cyan-400 to-purple-600',
      backgroundGradient: 'from-cyan-900 via-purple-900 to-pink-900',
      ticketIcon: '🔷'
    }
  ];

  private surpriseBonuses: SurpriseBonus[] = [
    {
      id: 'space_1000',
      type: 'space_tokens',
      value: 1000,
      message: 'Surprise! You found extra SPACE tokens!',
      emoji: '🎉'
    },
    {
      id: 'space_3000',
      type: 'space_tokens',
      value: 3000,
      message: 'Jackpot! Massive SPACE bonus!',
      emoji: '💰'
    },
    {
      id: 'extra_spin',
      type: 'extra_spin',
      value: 1,
      message: 'Bonus Spin unlocked!',
      emoji: '🔥'
    },
    {
      id: 'vip_access',
      type: 'vip_access',
      value: 10,
      message: 'VIP access for 10 minutes!',
      emoji: '💎'
    },
    {
      id: 'free_ticket',
      type: 'free_ticket',
      value: 1,
      message: 'Free ticket awarded!',
      emoji: '🎫'
    }
  ];

  static getInstance(): DailyRushService {
    if (!DailyRushService.instance) {
      DailyRushService.instance = new DailyRushService();
    }
    return DailyRushService.instance;
  }

  generateDailyEvent(): DailyRushEvent {
    const today = new Date().toISOString().split('T')[0];
    const theme = this.themes[Math.floor(Math.random() * this.themes.length)];
    const prizeValue = 5 + Math.random() * 20; // 5-25 TON
    
    const tickets: DailyRushTicket[] = [];
    
    // Generate 50 tickets with alternating free/paid pattern
    for (let i = 1; i <= 50; i++) {
      let type: 'free' | 'paid' = 'free';
      let cost = 0;
      
      if (i === 1) {
        type = 'free'; // First ticket is always free
      } else if (i >= 49) {
        type = 'paid';
        cost = 0.2; // Final tickets cost more
      } else if (i % 2 === 0) {
        type = 'paid';
        cost = 0.1;
      }
      
      tickets.push({
        number: i,
        type,
        cost,
        reward: i * 100 + Math.floor(Math.random() * 500), // Progressive rewards with randomness
        claimed: false,
        unlocked: i === 1 // Only first ticket is unlocked initially
      });
    }

    const bonuses: DailyRushBonus[] = [
      {
        step: 25,
        type: 'spin',
        reward: 'Bonus Spin Wheel',
        claimed: false
      },
      {
        step: 40,
        type: 'mystery_box',
        reward: 'Mystery Box',
        claimed: false
      },
      {
        step: 50,
        type: 'jackpot_entry',
        reward: 'Weekly TON Jackpot Entry',
        claimed: false
      }
    ];

    // Set countdown to end of day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    return {
      eventId: today,
      prize: `${prizeValue.toFixed(1)} TON`,
      prizeValue,
      theme: theme.name as any,
      tickets,
      bonuses,
      countdownEndsAt: tomorrow.toISOString(),
      isActive: true,
      currentStep: 0,
      totalSteps: 50
    };
  }

  getCurrentEvent(): DailyRushEvent {
    if (!this.currentEvent || this.isEventExpired()) {
      this.currentEvent = this.generateDailyEvent();
      this.saveEventToStorage();
    }
    return this.currentEvent;
  }

  private isEventExpired(): boolean {
    if (!this.currentEvent) return true;
    return new Date() > new Date(this.currentEvent.countdownEndsAt);
  }

  getUserProgress(userId: string): UserDailyProgress {
    if (!this.userProgress || this.userProgress.userId !== userId) {
      const currentEvent = this.getCurrentEvent();
      this.userProgress = {
        userId,
        eventId: currentEvent.eventId,
        currentTicket: 1,
        ticketsClaimed: [],
        bonusesClaimed: [],
        totalSpent: 0,
        lastActivity: new Date().toISOString(),
        surpriseBonusesReceived: 0
      };
      this.saveProgressToStorage();
    }
    return this.userProgress;
  }

  claimTicket(ticketNumber: number): { success: boolean; message: string; surpriseBonus?: SurpriseBonus } {
    const event = this.getCurrentEvent();
    const progress = this.getUserProgress('current_user'); // In real app, get from auth
    
    const ticket = event.tickets.find(t => t.number === ticketNumber);
    if (!ticket) {
      return { success: false, message: 'Ticket not found' };
    }

    if (ticket.claimed) {
      return { success: false, message: 'Ticket already claimed' };
    }

    if (!ticket.unlocked) {
      return { success: false, message: 'Previous tickets must be claimed first' };
    }

    // Mark ticket as claimed
    ticket.claimed = true;
    progress.ticketsClaimed.push(ticketNumber);
    progress.currentTicket = ticketNumber + 1;
    progress.lastActivity = new Date().toISOString();

    // Unlock next ticket
    const nextTicket = event.tickets.find(t => t.number === ticketNumber + 1);
    if (nextTicket) {
      nextTicket.unlocked = true;
    }

    // Update progress
    event.currentStep = progress.ticketsClaimed.length;

    // Check for surprise bonus (20% chance)
    let surpriseBonus: SurpriseBonus | undefined;
    if (Math.random() < 0.2 && progress.surpriseBonusesReceived < 5) {
      surpriseBonus = this.surpriseBonuses[Math.floor(Math.random() * this.surpriseBonuses.length)];
      progress.surpriseBonusesReceived++;
    }

    this.saveEventToStorage();
    this.saveProgressToStorage();

    return {
      success: true,
      message: `Claimed ${ticket.reward} SPACE tokens!`,
      surpriseBonus
    };
  }

  getTimeRemaining(): { hours: number; minutes: number; seconds: number } {
    const event = this.getCurrentEvent();
    const now = new Date().getTime();
    const end = new Date(event.countdownEndsAt).getTime();
    const diff = Math.max(0, end - now);

    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    };
  }

  getTheme(themeName: string): DailyTheme {
    return this.themes.find(t => t.name === themeName) || this.themes[0];
  }

  getProgressPercentage(): number {
    const event = this.getCurrentEvent();
    return (event.currentStep / event.totalSteps) * 100;
  }

  getMotivationalMessage(): string {
    const event = this.getCurrentEvent();
    const remaining = event.totalSteps - event.currentStep;
    
    const messages = [
      `Just ${remaining} more tickets to complete the rush!`,
      `${remaining} tickets left to unlock the final prize!`,
      `You're ${event.currentStep} steps closer to victory!`,
      `Almost there! ${remaining} tickets remaining!`,
      `Keep going! ${remaining} more to go!`
    ];

    if (remaining <= 5) {
      return `🔥 Final sprint! Only ${remaining} tickets left!`;
    } else if (remaining <= 10) {
      return `⚡ Almost there! ${remaining} tickets to go!`;
    }

    return messages[Math.floor(Math.random() * messages.length)];
  }

  private saveEventToStorage(): void {
    if (this.currentEvent) {
      localStorage.setItem('dailyRushEvent', JSON.stringify(this.currentEvent));
    }
  }

  private saveProgressToStorage(): void {
    if (this.userProgress) {
      localStorage.setItem('dailyRushProgress', JSON.stringify(this.userProgress));
    }
  }

  private loadFromStorage(): void {
    try {
      const eventData = localStorage.getItem('dailyRushEvent');
      if (eventData) {
        this.currentEvent = JSON.parse(eventData);
      }

      const progressData = localStorage.getItem('dailyRushProgress');
      if (progressData) {
        this.userProgress = JSON.parse(progressData);
      }
    } catch (error) {
      console.error('Error loading Daily Rush data:', error);
    }
  }

  constructor() {
    this.loadFromStorage();
  }
}

export const dailyRushService = DailyRushService.getInstance();
