
import { Language } from './languages/types';
import { SUPPORTED_LANGUAGES } from './languages/supportedLanguages';

// Enhanced translations - all in English
const translations: Record<string, string> = {
  // Basic navigation
  'mining': 'Mining',
  'tasks': 'Tasks',
  'wallet': 'Wallet',
  'friends': 'Friends',
  'premium': 'Premium',
  'store': 'Store',
  
  // Mining page
  'startMining': 'Start Mining',
  'stopMining': 'Stop Mining',
  'miningSpeed': 'Mining Speed',
  'spaceBalance': '$SPACE Balance',
  'autoMiningActive': 'Auto Mining Active',
  'autoActive': 'Auto Active',
  'autoMining': 'Auto mining',
  'autoMiningDesc': 'Enable automatic mining for 3 days. Your coins will be mined continuously without manual intervention.',
  'threeDaysDuration': '3 Days Duration',
  'purchaseAutoMining': 'Purchase Auto Mining',
  'timeRemaining': 'Time Remaining',
  'upgrade': 'Upgrade',
  'upgrades': 'Upgrades',
  'fasterMining': 'faster mining',
  'upgradeMiningSpeed': 'Upgrade your mining speed to earn more coins',
  'basicUpgrade': 'Basic Upgrade',
  'increaseMiningSpeed': 'Increase mining speed by 2x',
  'upgradeNow': 'Upgrade Now',
  'changeTheme': 'Change Theme',
  'currentBackground': 'Current',
  'unlocked': 'Unlocked',
  'select': 'Select',
  'stayUpdated': 'Stay Updated',
  'enableNotifications': 'Enable notifications for mining updates',
  'enableNow': 'Enable Now',
  'mainCurrency': 'Main Currency',
  'walletConnected': 'Wallet Connected',
  'disconnectWallet': 'Disconnect',
  
  // Tasks page
  'completeTasksEarn': 'Complete tasks to earn $SPACE tokens',
  'tasksCompleted': 'Tasks Completed',
  'noTasksAvailable': 'No Tasks Available',
  'noTasksDesc': 'Check back later for new tasks!',
  
  // Common UI
  'yes': 'Yes',
  'no': 'No',
  'loading': 'Loading...',
  'error': 'Error',
  'success': 'Success',
  'cancel': 'Cancel',
  'save': 'Save',
  'close': 'Close',
  'continue': 'Continue',
  
  // Wallet
  'connecting': 'Connecting...',
  'openConnectionWindow': 'Open Connection Window',
  'pleaseSelectWallet': 'Please select a wallet',
  'smartWallet': 'Smart Wallet',
  'walletDescription': 'Connect your TON wallet to start mining $SPACE coins',
  'connectWallet': 'Connect Wallet',
  'connectWalletToAccess': 'Connect your wallet to access wallet features',
  'receiveCoins': 'Receive Coins',
  'walletAddress': 'Wallet Address',
  'shareAddressInstruction': 'Share this address to receive payments',
  'copyAddress': 'Copy Address',
  'copied': 'Copied!',
  'walletAddressCopied': 'Wallet address copied to clipboard',
  'sendCurrency': 'Send',
  'availableBalance': 'Available Balance',
  'amount': 'Amount',
  'recipientAddress': 'Recipient Address',
  'sending': 'Sending...',
  'fillAllFields': 'Please fill all fields',
  'insufficientBalance': 'Insufficient Balance',
  'amountExceedsBalance': 'Amount exceeds available balance',
  'sentSuccessfully': 'Sent Successfully',
  'sentToAddress': 'sent to',
  'connectionError': 'Connection Error',
  'failedToOpenWallet': 'Failed to open wallet connection',
  'disconnected': 'Disconnected',
  'tonWalletDisconnected': 'TON wallet disconnected successfully',
  'loadingDataError': 'Loading Error',
  'failedToLoadWallet': 'Failed to load wallet data',
  
  // Friends/Referral
  'inviteFriendsEarn': 'Invite friends and earn $SPACE coins together',
  'totalReferrals': 'Total Referrals',
  'airdropBonus': 'Airdrop Bonus',
  'getReferralLink': 'Get Your Referral Link',
  'goToBot': 'Go to',
  'onTelegram': 'on Telegram',
  'sendCommand': 'Send the command',
  'receiveLink': 'You will receive your personal referral link',
  'openBot': 'Open @Spacelbot',
  
  // Premium/Subscription
  'premiumPlan': 'Premium',
  'vipPlan': 'VIP',
  'perMonth': 'per month',
  'fastSpeed': 'Fast speed (5x)',
  'bonusPoints': '+25% bonus points on tasks',
  'exclusiveBackgrounds': 'Exclusive backgrounds',
  'priorityEvents': 'Priority access to events',
  'vipBadge': 'VIP badge on profile',
  'prioritySupport': 'Priority support',
  'ultraFastMining': 'Ultra-fast mining (10x)',
  'unlimitedAutoMining': 'Unlimited auto mining',
  'exclusiveTasks': 'Exclusive VIP tasks',
  'allBackgrounds': 'All backgrounds unlocked',
  'vipSupport': '24/7 VIP support',
  'specialRewards': 'Special rewards & bonuses',
  'exclusiveFeatures': 'Exclusive features',
  'earlyAccess': 'Early access to new features',
  'unlockPremiumFeatures': 'Unlock premium features and boost your mining',
  'popular': 'Popular',
  'current': 'Current',
  'subscribeNow': 'Subscribe Now',
  'currentPlan': 'Current Plan',
  'premiumBenefits': 'Premium Benefits',
  
  // Store
  'premiumStore': 'Premium Store',
  'premiumSubscriptions': 'Premium Subscriptions',
  'miningUpgrades': 'Mining Upgrades',
  'mostPopular': 'Most Popular',
  'subscribeNow': 'Subscribe Now',
  'buyNow': 'Buy Now',
  'owned': 'Owned',
  'active': 'Active',
  'processing': 'Processing...',
  'walletRequired': 'Wallet Required',
  'connectWalletFirst': 'Please connect your TON wallet first',
  'purchaseSuccessful': 'Purchase Successful!',
  'activatedSuccessfully': 'activated successfully!',
  'paymentFailed': 'Payment Failed',
  'failedToProcessPayment': 'Failed to process payment',
  
  // Contests
  'contests': 'Contests',
  'joinContestsWinPrizes': 'Join contests and win amazing prizes',
  'dailyContest': 'Daily Contest',
  'weeklyContest': 'Weekly Contest',
  'dailyPrize': 'Daily Prize',
  'weeklyPrize': 'Weekly Prize',
  'timeLeft': 'Time Left',
  'hours': 'Hours',
  'minutes': 'Minutes',
  'seconds': 'Seconds',
  'days': 'Days',
  'participants': 'participants',
  'increaseChances': 'Increase Your Chances',
  'inviteFriends': 'Invite friends',
  'completeTasks': 'Complete tasks',
  'dailyMining': 'Daily mining activity',
  'joinContest': 'Join Contest',
  'lastWeekWinner': 'Last Week Winner',
  'contestRules': 'Contest Rules',
  'rule1': 'Winners are selected randomly from all participants',
  'rule2': 'Complete tasks and invite friends to increase your chances',
  'rule3': 'Prizes are distributed automatically to winners',
  'rule4': 'Each user can participate once per contest period'
};

export { SUPPORTED_LANGUAGES, type Language };

export const getStoredLanguage = (): Language => {
  return SUPPORTED_LANGUAGES[0]; // Always return English
};

export const setStoredLanguage = (language: Language): void => {
  // Do nothing - we only support English now
};

export const getTranslation = (key: string): string => {
  return translations[key] || key;
};

export const detectLanguage = (): Language => {
  return SUPPORTED_LANGUAGES[0]; // Always return English
};
