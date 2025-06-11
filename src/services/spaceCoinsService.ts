
class SpaceCoinsService {
  private static instance: SpaceCoinsService;
  private storageKey = 'spaceCoins';
  private listeners: ((coins: number) => void)[] = [];

  private constructor() {}

  static getInstance(): SpaceCoinsService {
    if (!SpaceCoinsService.instance) {
      SpaceCoinsService.instance = new SpaceCoinsService();
    }
    return SpaceCoinsService.instance;
  }

  getCoins(): number {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? parseFloat(stored) : 0;
  }

  setCoins(amount: number): void {
    localStorage.setItem(this.storageKey, amount.toString());
    this.notifyListeners(amount);
  }

  addCoins(amount: number): void {
    const currentCoins = this.getCoins();
    this.setCoins(currentCoins + amount);
  }

  subtractCoins(amount: number): boolean {
    const currentCoins = this.getCoins();
    if (currentCoins >= amount) {
      this.setCoins(currentCoins - amount);
      return true;
    }
    return false;
  }

  subscribe(listener: (coins: number) => void): () => void {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(coins: number): void {
    this.listeners.forEach(listener => listener(coins));
  }
}

export const spaceCoinsService = SpaceCoinsService.getInstance();
