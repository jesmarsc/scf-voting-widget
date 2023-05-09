import { useEffect } from 'react';
import { signal } from '@preact/signals';

import { stellarNetwork } from 'src/constants';

import FreighterAdapter from 'src/utils/wallet/FreighterAdapter';
import AlbedoAdapter from '../wallet/AlbedoAdapter';

const isWalletOpen = signal(false);

const useWallet = (selectedWallet: 'freighter' | 'albedo' = 'freighter') => {
  const walletAdapters = {
    freighter: new FreighterAdapter(stellarNetwork),
    albedo: new AlbedoAdapter(stellarNetwork),
  };

  const walletProxy = new Proxy(walletAdapters[selectedWallet], {
    get: (adapter, prop) => {
      const value = Reflect.get(adapter, prop);

      if (typeof value === 'function') {
        return function () {
          const result = value.apply(adapter, arguments);

          if (result instanceof Promise) {
            isWalletOpen.value = true;
            result.finally(() => (isWalletOpen.value = false));
          }

          return result;
        };
      }

      return value;
    },
  });

  useEffect(() => {
    return () => {
      isWalletOpen.value = false;
    };
  }, []);

  return { wallet: walletProxy, isOpen: isWalletOpen.value };
};

export default useWallet;
