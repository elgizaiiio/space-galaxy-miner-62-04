
import { useState, useEffect } from 'react';
import { spaceCoinsService } from '../services/spaceCoinsService';

export const useSpaceCoins = () => {
  const [spaceCoins, setSpaceCoins] = useState(spaceCoinsService.getCoins());

  useEffect(() => {
    const unsubscribe = spaceCoinsService.subscribe(setSpaceCoins);
    return unsubscribe;
  }, []);

  const addCoins = (amount: number) => {
    spaceCoinsService.addCoins(amount);
  };

  const subtractCoins = (amount: number) => {
    return spaceCoinsService.subtractCoins(amount);
  };

  const setCoins = (amount: number) => {
    spaceCoinsService.setCoins(amount);
  };

  return {
    spaceCoins,
    addCoins,
    subtractCoins,
    setCoins
  };
};
