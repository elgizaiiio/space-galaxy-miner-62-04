
export interface DailyRushTicket {
  number: number;
  type: 'free' | 'paid';
  cost?: number; // TON amount
  reward: number; // SPACE tokens
  claimed: boolean;
  unlocked: boolean;
}

export interface DailyRushBonus {
  step: number;
  type: 'random' | 'fixed' | 'jackpot_entry' | 'spin' | 'mystery_box';
  reward: string;
  claimed: boolean;
}

export interface DailyRushEvent {
  eventId: string;
  prize: string;
  prizeValue: number; // TON amount
  theme: 'Galaxy' | 'Volcano' | 'Electric' | 'Ocean' | 'Forest' | 'Cyber';
  tickets: DailyRushTicket[];
  bonuses: DailyRushBonus[];
  countdownEndsAt: string;
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
}

export interface UserDailyProgress {
  userId: string;
  eventId: string;
  currentTicket: number;
  ticketsClaimed: number[];
  bonusesClaimed: number[];
  totalSpent: number; // TON
  lastActivity: string;
  surpriseBonusesReceived: number;
}

export interface SurpriseBonus {
  id: string;
  type: 'space_tokens' | 'extra_spin' | 'vip_access' | 'free_ticket';
  value: number;
  message: string;
  emoji: string;
}

export interface DailyTheme {
  name: string;
  emoji: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundGradient: string;
  ticketIcon: string;
}
