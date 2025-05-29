import { Language, TranslationMap } from './languages/types';
import { SUPPORTED_LANGUAGES } from './languages/supportedLanguages';
import { commonTranslations } from './languages/commonTranslations';
import { miningTranslations } from './languages/miningTranslations';
import { subscriptionTranslations } from './languages/subscriptionTranslations';
import { contestTranslations } from './languages/contestTranslations';

// Combine all translations
const TRANSLATIONS: TranslationMap = {
  ...commonTranslations,
  ...miningTranslations,
  ...subscriptionTranslations,
  ...contestTranslations
};

export { SUPPORTED_LANGUAGES, type Language };

export const getStoredLanguage = (): Language => {
  const stored = localStorage.getItem('selectedLanguage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const found = SUPPORTED_LANGUAGES.find(lang => lang.code === parsed.code);
      if (found) return found;
    } catch (e) {
      console.warn('Failed to parse stored language:', e);
    }
  }
  return SUPPORTED_LANGUAGES[0]; // Default to English
};

export const setStoredLanguage = (language: Language): void => {
  localStorage.setItem('selectedLanguage', JSON.stringify(language));
};

export const getTranslation = (key: string, languageCode: string): string => {
  const translation = TRANSLATIONS[key];
  if (!translation) {
    console.warn(`Translation key "${key}" not found`);
    return key;
  }
  
  return translation[languageCode] || translation.en || key;
};

export const detectLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase().split('-')[0];
  const found = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
  return found || SUPPORTED_LANGUAGES[0]; // Default to English
};
