<template>
  <div class="page">
    <div class="content">
      <h1>Public MEV explorer</h1>
      <div class="form">
        <div class="form-inputs">
          <div class="chain">
            <MetaSelect
              v-model="chainId"
              :options="chains"
              :label="'Chain'"
            />
          </div>
          <div class="tx">
            <MetaInput
              v-model="txHash"
              :label="'Transaction hash'"
            />
          </div>
          <div class="example">
            <div @click="getExample()">Try random example</div>
          </div>
        </div>
        <div>
          <MetaButton
            :disabled="loading || !isValidTx"
            :label="'Inspect'"
            @click="inspect"
          />
        </div>
      </div>
      <div
        v-if="loading"
        class="loading"
      >
        <LoadingIndicator />
      </div>
      <div
        v-else
        class="mevs"
      >
        <MetaCard
          v-for="(arbitrage, index) in arbitrages"
          :key="index"
        >
          <h2>Arbitrage</h2>
          <div>Start amount: {{ arbitrage.startAmount }}</div>
          <div>End amount: {{ arbitrage.endAmount }}</div>
          <div>Profit asset: {{ arbitrage.profitAsset }}</div>
          <div class="swaps">
            <div
              v-for="swap in arbitrage.swaps"
              :key="swap.event.logIndex"
              class="swap"
            >
              <div>From: {{ swap.from }}</div>
              <div>To: {{ swap.to }}</div>
              <div>Amount in: {{ swap.amountIn }}</div>
              <div>Asset in: {{ swap.assetIn }}</div>
              <div>Amount out: {{ swap.amountOut }}</div>
              <div>Asset out: {{ swap.assetOut }}</div>
              <div>Protocol: {{ swap.contract.protocol.abi }}</div>
              <div>Venue: {{ swap.event.address }}</div>
            </div>
          </div>
        </MetaCard>

        <MetaCard
          v-for="(liquidation, index) in liquidations"
          :key="index"
        >
          <h2>Liquidation</h2>
          <div>Collateral amount: {{ liquidation.seizure.amount }}</div>
          <div>Collateral asset: {{ liquidation.seizure.asset }}</div>
          <div>Debt amount: {{ liquidation.repayment.amount }}</div>
          <div>Debt asset: {{ liquidation.repayment.asset }}</div>
          <div>Liquidator: {{ liquidation.seizure.seizor }}</div>
          <div>Borrower: {{ liquidation.seizure.borrower }}</div>
          <div>Contract: {{ liquidation.seizure.contract.protocol.abi }}</div>
          <div>Venue: {{ liquidation.seizure.event.address }}</div>
        </MetaCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlchemyProvider } from '@ethersproject/providers';
import {
  Arbitrage,
  ChainId,
  Inspector,
  Liquidation,
  TxMev,
  isArbitrage,
  isLiquidation,
} from 'mev-inspect';
import { computed, ref, watch } from 'vue';

import LoadingIndicator from '@/components/LoadingIndicator.vue';
import MetaButton from '@/components/MetaButton.vue';
import MetaCard from '@/components/MetaCard.vue';
import MetaInput from '@/components/MetaInput.vue';
import MetaSelect from '@/components/MetaSelect.vue';

interface Example {
  label: string;
  hash: string;
  chainId: string;
}

const examples: Example[] = [
  {
    label: 'Uniswap V2 X Uniswap V3 arbitrage',
    hash: '0x88e99b372a7524a750bb846b91cd9433a22c7cce886edee4879b70cb47f0d0fe',
    chainId: '1',
  },
  {
    label: 'Compound liquidation',
    hash: '0xdf838db24228f280eba8a279266d1602b03b54507afdca3cb4b4ec640535642b',
    chainId: '1',
  },
  {
    label: 'Aave V2 AMM market liquidation',
    hash: '0x9529b0332f51d586a1d30f9106558daf3dbc66c6bbbd32935f19fbc2601b7aa1',
    chainId: '1',
  },
  {
    label: 'Balancer V2 X Sushiswap arbitrage (Polygon)',
    hash: '0xde56117bfdf9fe034b9e6bdebfc113df28ae93e8cd26c2be872f0c251c256aeb',
    chainId: '137',
  },
  {
    label: 'Aave V3 liquidation (Arbitrum)',
    hash: '0x0891c3846336c495821436adc35eda17bcd01588b1706d4bbb16f3eab59e3f82',
    chainId: '42161',
  },
];

interface Chain {
  label: string;
  value: string;
}

const chains: Chain[] = [
  {
    label: 'Ethereum',
    value: '1',
  },
  {
    label: 'Polygon',
    value: '137',
  },
  {
    label: 'Arbitrum',
    value: '42161',
  },
];

const chainId = ref('1');

const txHash = ref('');

const loading = ref(false);

const mev = ref<TxMev[]>([]);

const arbitrages = computed(() =>
  mev.value.filter((mevItem: TxMev): mevItem is Arbitrage =>
    isArbitrage(mevItem),
  ),
);

const liquidations = computed(() =>
  mev.value.filter((mevItem: TxMev): mevItem is Liquidation =>
    isLiquidation(mevItem),
  ),
);

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
  const chain = parseInt(chainId.value) as ChainId;
  loading.value = true;
  const provider = new AlchemyProvider(
    chain,
    'NEwRam_rhHUN2SJWDeHcU5Luij4Tcuxq',
  );
  const inspect = new Inspector(chain, provider);
  mev.value = await inspect.tx(txHash.value);
  loading.value = false;
}

const isValidTx = computed(() => {
  const groups = txHash.value.match(/0x[0-9a-f]{64}/);
  return !!groups && groups.length > 0;
});
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  margin: 16px;
}

@media screen and (min-width: 768px) {
  .page {
    padding: 60px;
  }

  .content {
    width: 600px;
    margin: initial;
  }
}

h1 {
  margin: 0;
  font-size: 20px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-inputs {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h2 {
  margin: 0;
  margin-bottom: 16px;
  font-size: 16px;
  text-align: center;
}

.chain,
.tx {
  display: flex;
  gap: 8px;
}

.example {
  color: #e87d00;
  font-size: 14px;
  cursor: pointer;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mevs {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
