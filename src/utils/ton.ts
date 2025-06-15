
import { TonConnect } from '@tonconnect/sdk';

export const TON_PAYMENT_ADDRESS = 'UQCiVNm22dMF9S3YsHPcgrmqXEQHt4MIdk_N7VJu88NrLr4R';

export interface UpgradeOption {
  id: string;
  multiplier: number;
  price: number;
  label: string;
}

export const UPGRADE_OPTIONS: UpgradeOption[] = [
  { id: 'x2', multiplier: 2, price: 0.2, label: 'x2 Speed' },
  { id: 'x5', multiplier: 5, price: 0.5, label: 'x5 Speed' },
  { id: 'x10', multiplier: 10, price: 1, label: 'x10 Speed' },
  { id: 'x25', multiplier: 25, price: 2.5, label: 'x25 Speed' },
  { id: 'x50', multiplier: 50, price: 5, label: 'x50 Speed' },
  { id: 'x120', multiplier: 120, price: 10, label: 'x120 Speed' },
];

export const createTonConnector = () => {
  return new TonConnect({
    manifestUrl: window.location.origin + '/tonconnect-manifest.json',
  });
};

export const formatTON = (amount: number): string => {
  return amount.toFixed(2) + ' TON';
};

// Helper function to convert text to base64 for TON comment using browser-compatible encoding
export const textToBase64 = (text: string): string => {
  try {
    // Use btoa with proper UTF-8 encoding for browser compatibility
    return btoa(unescape(encodeURIComponent(text)));
  } catch (error) {
    console.error('Error encoding text to base64:', error);
    return '';
  }
};

export const sendTONPayment = async (tonConnector: TonConnect, amount: number, comment?: string) => {
  try {
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
      messages: [
        {
          address: TON_PAYMENT_ADDRESS,
          amount: (amount * 1e9).toString(), // Convert to nanoTON
          payload: comment ? textToBase64(comment) : undefined,
        },
      ],
    };

    const result = await tonConnector.sendTransaction(transaction);
    return result;
  } catch (error) {
    console.error('TON payment failed:', error);
    throw error;
  }
};
