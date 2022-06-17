import { Provider, TransactionReceipt } from '@ethersproject/providers';

class Ethereum {
  provider: Provider;

  constructor(provider: Provider) {
    this.provider = provider;
  }

  async getReceipt(hash: string): Promise<TransactionReceipt> {
    return this.provider.getTransactionReceipt(hash);
  }
}

export default Ethereum;
