<template>
  <div class="page">
    <div class="content">
      <div class="chain">
        <label for="chain-selector">Chain</label>
        <select
          id="chain-selector"
          v-model="chainId"
        >
          <option
            v-for="chain in chains"
            :key="chain.value"
            :value="chain.value"
          >
            {{ chain.label }}
          </option>
        </select>
      </div>
      <div class="tx">
        <label for="tx-input">Transaction hash</label>
        <input
          id="tx-input"
          v-model="txHash"
          type="text"
        />
      </div>
      <div class="example">
        <div @click="getExample()">Try random example</div>
      </div>
      <div>
        <button
          :disabled="loading"
          @click="inspect"
        >
          Inspect
        </button>
      </div>
      <div
        v-if="!loading"
        class="mevs"
      >
        <div
          v-for="(mevItem, index) in mev"
          :key="index"
          class="mev"
        >
          <div v-if="mevItem.swaps">
            <h3>Arbitrage</h3>
            <div>start amount: {{ mevItem.startAmount }}</div>
            <div>end amount: {{ mevItem.endAmount }}</div>
            <div>profit asset: {{ mevItem.profitAsset }}</div>
            <div class="swaps">
              <div
                v-for="swap in mevItem.swaps"
                :key="swap.event.logIndex"
                class="swap"
              >
                <div>from: {{ swap.from }}</div>
                <div>to: {{ swap.to }}</div>
                <div>amount in: {{ swap.amountIn }}</div>
                <div>amount out: {{ swap.amountOut }}</div>
                <div>asset in: {{ swap.assetIn }}</div>
                <div>asset out: {{ swap.assetOut }}</div>
                <div>contract: {{ swap.contract }}</div>
                <div>event: {{ swap.event }}</div>
                <div>transaction: {{ swap.transaction }}</div>
              </div>
            </div>
          </div>
          <div v-else-if="mevItem.repayment">
            <h3>Liquidation</h3>
            <div>collateral amount: {{ mevItem.seizure.amount }}</div>
            <div>debt amount: {{ mevItem.repayment.amount }}</div>
            <div>collateral asset: {{ mevItem.seizure.assetC }}</div>
            <div>debt asset: {{ mevItem.repayment.assetD }}</div>
            <div>liquidator: {{ mevItem.seizure.seizor }}</div>
            <div>borrower: {{ mevItem.seizure.borrower }}</div>
            <div>contract: {{ mevItem.seizure.contract }}</div>
            <div>event: {{ mevItem.seizure.event }}</div>
            <div>transaction: {{ mevItem.seizure.transaction }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { AlchemyProvider } from '@ethersproject/providers';
import { ChainId, Inspector, TxMev } from 'mev-inspect';
import { ref, watch } from 'vue';

interface Example {
  label: string;
  hash: string;
  chainId: ChainId;
}

const examples: Example[] = [
  {
    label: 'Uniswap V2 X Uniswap V3 arbitrage',
    hash: '0x88e99b372a7524a750bb846b91cd9433a22c7cce886edee4879b70cb47f0d0fe',
    chainId: 1,
  },
  {
    label: 'Compound liquidation',
    hash: '0xdf838db24228f280eba8a279266d1602b03b54507afdca3cb4b4ec640535642b',
    chainId: 1,
  },
  {
    label: 'Aave V2 AMM market liquidation',
    hash: '0x9529b0332f51d586a1d30f9106558daf3dbc66c6bbbd32935f19fbc2601b7aa1',
    chainId: 1,
  },
  {
    label: 'Balancer V2 X Sushiswap arbitrage (Polygon)',
    hash: '0xde56117bfdf9fe034b9e6bdebfc113df28ae93e8cd26c2be872f0c251c256aeb',
    chainId: 137,
  },
  {
    label: 'Aave V3 liquidation (Arbitrum)',
    hash: '0x0891c3846336c495821436adc35eda17bcd01588b1706d4bbb16f3eab59e3f82',
    chainId: 42161,
  },
];

interface Chain {
  label: string;
  value: ChainId;
}

const chains: Chain[] = [
  {
    label: 'Ethereum',
    value: 1,
  },
  {
    label: 'Polygon',
    value: 137,
  },
  {
    label: 'Arbitrum',
    value: 42161,
  },
];

const chainId = ref<ChainId>(1);

const txHash = ref('');

const loading = ref(false);

const mev = ref<TxMev[]>([]);

watch(chainId, () => {
  mev.value = [];
});

watch(txHash, () => {
  mev.value = [];
});

function getExample(): void {
  const index = Math.floor(Math.random() * examples.length);
  const example = examples[index];
  chainId.value = example.chainId;
  txHash.value = example.hash;
}

async function inspect(): Promise<void> {
  loading.value = true;
  const provider = new AlchemyProvider(
    chainId.value,
    'NEwRam_rhHUN2SJWDeHcU5Luij4Tcuxq',
  );
  const inspect = new Inspector(chainId.value, provider);
  mev.value = await inspect.tx(txHash.value);
  loading.value = false;
}
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin: 16px;
}

@media screen and (min-width: 768px) {
  .page {
    margin-top: 60px;
  }

  .content {
    width: 600px;
    margin: initial;
  }
}

.chain,
.tx {
  display: flex;
  gap: 8px;
}

.example {
  color: #6a40d5;
  font-size: 14px;
  cursor: pointer;
}

.mevs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mev {
  padding: 8px;
  background: #eee;
}

.swaps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.swap {
  padding: 8px;
  background: #ccc;
}
</style>
