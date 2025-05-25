
export interface Language {
  code: string;
  name: string;
  greeting: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', greeting: 'Welcome', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', greeting: 'مرحبا', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', greeting: 'Добро пожаловать', flag: '🇷🇺' },
  { code: 'zh', name: '中文', greeting: '欢迎', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', greeting: 'स्वागत है', flag: '🇮🇳' },
  { code: 'es', name: 'Español', greeting: 'Bienvenido', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', greeting: 'Bienvenue', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', greeting: 'Willkommen', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', greeting: 'ようこそ', flag: '🇯🇵' },
  { code: 'tr', name: 'Türkçe', greeting: 'Hoş geldiniz', flag: '🇹🇷' },
  { code: 'pt', name: 'Português', greeting: 'Bem-vindo', flag: '🇧🇷' },
  { code: 'uk', name: 'Українська', greeting: 'Ласкаво просимо', flag: '🇺🇦' },
];

export const detectLanguage = (): Language => {
  // Try to get language from Telegram WebApp
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code) {
    const telegramLang = window.Telegram.WebApp.initDataUnsafe.user.language_code;
    const found = SUPPORTED_LANGUAGES.find(lang => lang.code === telegramLang);
    if (found) return found;
  }

  // Fallback to browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    const found = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
    if (found) return found;
  }

  // Default to English
  return SUPPORTED_LANGUAGES[0];
};

export const getStoredLanguage = (): Language => {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('space-language');
    if (stored) {
      const found = SUPPORTED_LANGUAGES.find(lang => lang.code === stored);
      if (found) return found;
    }
  }
  return detectLanguage();
};

export const setStoredLanguage = (language: Language): void => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('space-language', language.code);
  }
};
