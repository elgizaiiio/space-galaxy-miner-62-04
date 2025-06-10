
interface Translations {
  [key: string]: string;
}

// English translations (default)
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

const getCurrentLanguage = (): string => {
  return 'en'; // Always return English
};

export const getTranslation = (key: string): string => {
  return enTranslations[key] || key;
};

export const setLanguage = (language: string) => {
  // Do nothing - always use English
};
