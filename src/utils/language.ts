
interface Translations {
  [key: string]: string;
}

// English translations (now default)
const enTranslations: Translations = {
  mining: 'Mining',
  tasks: 'Tasks', 
  wallet: 'Wallet',
  friends: 'Friends',
  settings: 'Settings',
  mainTasks: 'Main Tasks',
  partnerTasks: 'Partner Tasks',
  dailyTasks: 'Daily Tasks',
  connectWallet: 'Connect Wallet',
  connectWalletDesc: 'Connect your wallet to start mining',
  firstMine: 'First Mine',
  firstMineDesc: 'Complete your first mining operation',
  completeProfile: 'Complete Profile',
  completeProfileDesc: 'Complete your profile information',
  joinTelegram: 'Join Telegram',
  joinTelegramDesc: 'Join our Telegram channel',
  followTwitter: 'Follow Twitter',
  followTwitterDesc: 'Follow our Twitter account',
  subscribeYoutube: 'Subscribe YouTube',
  subscribeYoutubeDesc: 'Subscribe to our YouTube channel',
  dailyLogin: 'Daily Login',
  dailyLoginDesc: 'Complete your daily login',
  dailyMine: 'Daily Mine',
  dailyMineDesc: 'Complete your daily mining',
  dailyShare: 'Daily Share',
  dailyShareDesc: 'Share the app daily',
  taskCompleted: 'Task Completed',
  earnedReward: 'You earned',
  completeTasksEarn: 'Complete tasks and earn $SPACE coins'
};

// Arabic translations
const arTranslations: Translations = {
  mining: 'التعدين',
  tasks: 'المهام',
  wallet: 'المحفظة',
  friends: 'الأصدقاء',
  settings: 'الإعدادات',
  mainTasks: 'المهام الرئيسية',
  partnerTasks: 'مهام الشركاء',
  dailyTasks: 'المهام اليومية',
  connectWallet: 'ربط المحفظة',
  connectWalletDesc: 'اربط محفظتك لتبدأ التعدين',
  firstMine: 'أول عملية تعدين',
  firstMineDesc: 'قم بأول عملية تعدين لك',
  completeProfile: 'أكمل الملف الشخصي',
  completeProfileDesc: 'أكمل معلومات ملفك الشخصي',
  joinTelegram: 'انضم إلى تيليجرام',
  joinTelegramDesc: 'انضم إلى قناتنا على تيليجرام',
  followTwitter: 'تابع على تويتر',
  followTwitterDesc: 'تابع حسابنا على تويتر',
  subscribeYoutube: 'اشترك في يوتيوب',
  subscribeYoutubeDesc: 'اشترك في قناتنا على يوتيوب',
  dailyLogin: 'تسجيل دخول يومي',
  dailyLoginDesc: 'سجل دخولك اليومي',
  dailyMine: 'تعدين يومي',
  dailyMineDesc: 'قم بالتعدين اليومي',
  dailyShare: 'مشاركة يومية',
  dailyShareDesc: 'شارك التطبيق يومياً',
  taskCompleted: 'تم إنجاز المهمة',
  earnedReward: 'لقد ربحت',
  completeTasksEarn: 'أكمل المهام واربح عملات $SPACE'
};

const getCurrentLanguage = (): string => {
  return localStorage.getItem('language') || 'en'; // Default to English
};

export const getTranslation = (key: string): string => {
  const language = getCurrentLanguage();
  const translations = language === 'ar' ? arTranslations : enTranslations;
  return translations[key] || key;
};

export const setLanguage = (language: string) => {
  localStorage.setItem('language', language);
};
