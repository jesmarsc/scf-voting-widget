abstract class Adapter {
  private _network: Network;
  abstract metadata: Metadata;

  constructor(network: Network) {
    this._network = network;
  }

  get network() {
    return this._network;
  }

  abstract getPublicKey(): Promise<string>;

  abstract signTransaction(xdr: string, options?: Options): Promise<string>;
  abstract signMessage(message?: string): Promise<SignedMessage>;
}

type Network = 'PUBLIC' | 'TESTNET';

interface Options {
  publicKey?: string;
}

interface Metadata {
  name: string;
  url: string;
}

export { Adapter, Network, Options, Metadata };
