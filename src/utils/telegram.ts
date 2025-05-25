
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export const initTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    webApp.ready();
    webApp.expand();
    return webApp;
  }
  return null;
};

export const getTelegramUser = (): TelegramUser | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  return null;
};

export const getReferralCode = (): string | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.start_param) {
    return window.Telegram.WebApp.initDataUnsafe.start_param;
  }
  return null;
};

export const generateReferralLink = (userId: number): string => {
  return `https://t.me/Spacelbot?start=${userId}`;
};

export const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
    const haptic = window.Telegram.WebApp.HapticFeedback;
    if (type === 'success' || type === 'error' || type === 'warning') {
      haptic.notificationOccurred(type);
    } else {
      haptic.impactOccurred(type);
    }
  }
};
