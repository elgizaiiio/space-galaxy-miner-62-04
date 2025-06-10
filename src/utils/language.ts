
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
  completeTasksEarn: 'Complete tasks and earn $SPACE coins',
  receiveCoins: 'Receive Coins',
  walletAddress: 'Wallet Address',
  shareAddressInstruction: 'Share this address to receive coins',
  copied: 'Copied',
  walletAddressCopied: 'Wallet address copied to clipboard',
  copyAddress: 'Copy Address'
};

const getCurrentLanguage = (): string => {
  return 'en'; // Always return English
};

export const getTranslation = (key: string): string => {
  // Return the translation if it exists, otherwise return the key itself
  const translation = enTranslations[key];
  return translation || key;
};

export const setLanguage = (language: string) => {
  // Do nothing - always use English
};
