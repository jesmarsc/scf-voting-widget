import freighter from '@stellar/freighter-api';

import { Adapter, Network, Options } from './Adapter';

class FreighterAdapter extends Adapter {
  metadata = { name: 'Freighter', url: 'https://www.freighter.app/' };

  constructor(network: Network) {
    super(network);
  }

  getPublicKey() {
    return freighter.getPublicKey();
  }

  signTransaction(xdr: string, options?: Options) {
    return freighter.signTransaction(xdr, {
      network: this.network,
      accountToSign: options?.publicKey,
    });
  }
}

export default FreighterAdapter;
