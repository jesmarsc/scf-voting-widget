import freighter from '@stellar/freighter-api';

import { Adapter, Network, Options } from './Adapter';
import { randomString } from '../discord';

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

  async signMessage(message?: string) {
    const token = message || randomString(16);
    const pk = await this.getPublicKey();
    return {
      pk,
      message: token,
      signature: '',
    };
  }
}

export default FreighterAdapter;
