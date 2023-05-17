import albedo from '@albedo-link/intent';
import { Adapter, Network, Options } from './Adapter';
import { randomString } from '../discord';

class AlbedoAdapter extends Adapter {
  metadata = { name: 'Albedo', url: 'https://albedo.link/' };

  constructor(network: Network) {
    super(network);
  }

  getPublicKey() {
    return albedo.publicKey({}).then((result) => result.pubkey);
  }

  signTransaction(xdr: string, options?: Options) {
    return albedo
      .tx({ xdr, network: this.network, pubkey: options?.publicKey })
      .then((result) => result.signed_envelope_xdr);
  }

  signMessage(message?: string) {
    const token = message || randomString(16);

    return albedo.publicKey({ token }).then((result) => ({
      pk: result.pubkey,
      message: token,
      signature: result.signature,
    }));
  }
}

export default AlbedoAdapter;
