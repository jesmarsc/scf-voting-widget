import { useEffect } from 'react';
import { signal } from '@preact/signals';

import { stellarNetwork } from 'src/constants';

import FreighterAdapter from 'src/utils/wallet/FreighterAdapter';

const walletAdapters = {
  freighter: new FreighterAdapter(stellarNetwork),
};

const selectedWallet = walletAdapters.freighter;

const isWalletOpen = signal(false);

const walletProxy = new Proxy(selectedWallet, {
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

const useWallet = () => {
  useEffect(() => {
    return () => {
      isWalletOpen.value = false;
    };
  }, []);

  return { wallet: walletProxy, isOpen: isWalletOpen.value };
};

export default useWallet;
