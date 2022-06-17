interface BlockRequest {
  block_number?: number;
  miner?: string;
  from?: string;
  before?: number;
  limit?: number;
}

interface BlockListResponse {
  latest_block_number: number;
  blocks: BlockResponse[];
}

interface BlockResponse {
  block_number: number;
  miner: string;
  miner_reward: string;
  coinbase_transfers: string;
  gas_used: number;
  gas_price: string;
  transactions: TransactionResponse[];
}

interface TransactionResponse {
  transaction_hash: string;
  tx_index: number;
  bundle_type: 'flashbots' | 'rogue' | 'miner_payout';
  bundle_index: number;
  block_number: number;
  eoa_address: string;
  to_address : string;
  gas_used: number;
  gas_price: string;
  coinbase_transfer: string;
  total_miner_reward: string;
  is_megabundle?: boolean;
}

interface Block {
  number: number;
  miner: string;
  reward: bigint;
  bundles: Bundle[];
}

interface Bundle {
  transactions: Transaction[];
  type: 'Flashbots' | 'Rogue' | 'MinerPayout';
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
}

class Flashbots {
  async getLatestBlocks(limit: number): Promise<Block[]> {
    const blockListResponse = await this.#fetchBlocks({
      limit,
    });
    return blockListResponse.blocks.map((response) => this.#formatBlock(response));
  }

  async getBlock(number: number): Promise<Block> {
    const blockListResponse = await this.#fetchBlocks({
      block_number: number,
    });
    const blockResponse = blockListResponse.blocks[0];
    return this.#formatBlock(blockResponse);
  }

  async #fetchBlocks(params: BlockRequest): Promise<BlockListResponse> {
    const apiEndpoint = 'https://blocks.flashbots.net';
    const url = new URL(`${apiEndpoint}/v1/blocks`);
    const paramValues: Record<string, string> = {};
    for (const index in Object.entries(params)) {
      const [key, value] = Object.entries(params)[index];
      paramValues[key] = value;
    }
    url.search = new URLSearchParams(paramValues).toString();
    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  }

  #formatBlock(response: BlockResponse): Block {
    const block: Block = {
      number: response.block_number,
      miner: response.miner,
      reward: BigInt(response.miner_reward),
      bundles: [],
    }
    for (const transactionResponse of response.transactions) {
      if (block.bundles.length <= transactionResponse.bundle_index) {
        const type = transactionResponse.bundle_type;
        const bundle: Bundle = {
          type: type === 'flashbots' ? 'Flashbots' : type === 'rogue' ? 'Rogue' : 'MinerPayout',
          transactions: [],
        };
        block.bundles.push(bundle);
      }
      const transaction: Transaction = {
        hash: transactionResponse.transaction_hash,
        from: transactionResponse.eoa_address,
        to: transactionResponse.to_address,
      };
      block.bundles[transactionResponse.bundle_index].transactions.push(transaction);
    }
    return block;
  }
}

export default Flashbots;

export { Block };
