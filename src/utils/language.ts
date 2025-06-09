
import { Language, TranslationMap } from './languages/types';
import { SUPPORTED_LANGUAGES } from './languages/supportedLanguages';
import { commonTranslations } from './languages/commonTranslations';
import { miningTranslations } from './languages/miningTranslations';
import { subscriptionTranslations } from './languages/subscriptionTranslations';
import { contestTranslations } from './languages/contestTranslations';

// Combine all translations
const translations: TranslationMap = {
  ...miningTranslations,
  ...commonTranslations,
  ...subscriptionTranslations,
  ...contestTranslations
};

// Default translations for missing keys
const defaultTranslations: Record<string, Record<string, string>> = {
  'mining': {
    en: 'Mining',
    ar: 'التعدين',
    ru: 'Добыча',
    zh: '挖矿',
    hi: 'माइनिंग',
    es: 'Minería',
    fr: 'Minage',
    de: 'Mining',
    ja: 'マイニング',
    tr: 'Madencilik',
    pt: 'Mineração',
    uk: 'Видобуток'
  },
  'tasks': {
    en: 'Tasks',
    ar: 'المهام',
    ru: 'Задачи',
    zh: '任务',
    hi: 'कार्य',
    es: 'Tareas',
    fr: 'Tâches',
    de: 'Aufgaben',
    ja: 'タスク',
    tr: 'Görevler',
    pt: 'Tarefas',
    uk: 'Завдання'
  },
  'wallet': {
    en: 'Wallet',
    ar: 'المحفظة',
    ru: 'Кошелёк',
    zh: '钱包',
    hi: 'वॉलेट',
    es: 'Billetera',
    fr: 'Portefeuille',
    de: 'Geldbörse',
    ja: 'ウォレット',
    tr: 'Cüzdan',
    pt: 'Carteira',
    uk: 'Гаманець'
  },
  'friends': {
    en: 'Friends',
    ar: 'الأصدقاء',
    ru: 'Друзья',
    zh: '朋友',
    hi: 'दोस्त',
    es: 'Amigos',
    fr: 'Amis',
    de: 'Freunde',
    ja: '友達',
    tr: 'Arkadaşlar',
    pt: 'Amigos',
    uk: 'Друзі'
  },
  'premium': {
    en: 'Premium',
    ar: 'المميز',
    ru: 'Премиум',
    zh: '高级',
    hi: 'प्रीमियम',
    es: 'Premium',
    fr: 'Premium',
    de: 'Premium',
    ja: 'プレミアム',
    tr: 'Premium',
    pt: 'Premium',
    uk: 'Преміум'
  },
  'completeTasksEarn': {
    en: 'Complete tasks to earn $SPACE tokens',
    ar: 'أكمل المهام لكسب رموز $SPACE',
    ru: 'Выполняйте задачи, чтобы заработать токены $SPACE',
    zh: '完成任务赚取 $SPACE 代币',
    hi: '$SPACE टोकन कमाने के लिए कार्य पूरे करें',
    es: 'Completa tareas para ganar tokens $SPACE',
    fr: 'Complétez les tâches pour gagner des jetons $SPACE',
    de: 'Erledige Aufgaben, um $SPACE-Token zu verdienen',
    ja: 'タスクを完了して$SPACEトークンを獲得',
    tr: '$SPACE token kazanmak için görevleri tamamlayın',
    pt: 'Complete tarefas para ganhar tokens $SPACE',
    uk: 'Виконуйте завдання, щоб заробити токени $SPACE'
  },
  'tasksCompleted': {
    en: 'Tasks Completed',
    ar: 'المهام المكتملة',
    ru: 'Задачи выполнены',
    zh: '已完成任务',
    hi: 'पूरे किए गए कार्य',
    es: 'Tareas Completadas',
    fr: 'Tâches Terminées',
    de: 'Aufgaben Erledigt',
    ja: '完了したタスク',
    tr: 'Tamamlanan Görevler',
    pt: 'Tarefas Concluídas',
    uk: 'Завершені завдання'
  },
  'noTasksAvailable': {
    en: 'No Tasks Available',
    ar: 'لا توجد مهام متاحة',
    ru: 'Нет доступных задач',
    zh: '没有可用任务',
    hi: 'कोई कार्य उपलब्ध नहीं',
    es: 'No hay tareas disponibles',
    fr: 'Aucune tâche disponible',
    de: 'Keine Aufgaben verfügbar',
    ja: '利用可能なタスクがありません',
    tr: 'Mevcut görev yok',
    pt: 'Nenhuma tarefa disponível',
    uk: 'Немає доступних завдань'
  },
  'noTasksDesc': {
    en: 'Check back later for new tasks!',
    ar: 'تحقق مرة أخرى لاحقاً للحصول على مهام جديدة!',
    ru: 'Зайдите позже для новых задач!',
    zh: '稍后查看新任务！',
    hi: 'नए कार्यों के लिए बाद में वापस देखें!',
    es: '¡Vuelve más tarde para nuevas tareas!',
    fr: 'Revenez plus tard pour de nouvelles tâches !',
    de: 'Schauen Sie später für neue Aufgaben vorbei!',
    ja: '新しいタスクについては後でご確認ください！',
    tr: 'Yeni görevler için daha sonra tekrar kontrol edin!',
    pt: 'Volte mais tarde para novas tarefas!',
    uk: 'Поверніться пізніше за новими завданнями!'
  }
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
  // First check combined translations
  const translation = translations[key];
  if (translation && translation[languageCode]) {
    return translation[languageCode];
  }
  
  // Then check default translations
  const defaultTranslation = defaultTranslations[key];
  if (defaultTranslation && defaultTranslation[languageCode]) {
    return defaultTranslation[languageCode];
  }
  
  // Fallback to English from either source
  if (translation && translation.en) {
    return translation.en;
  }
  
  if (defaultTranslation && defaultTranslation.en) {
    return defaultTranslation.en;
  }
  
  console.warn(`Translation key "${key}" not found`);
  return key;
};

export const detectLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase().split('-')[0];
  const found = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
  return found || SUPPORTED_LANGUAGES[0]; // Default to English
};
