<template>
  <div class="page">
    <div class="content">
      <h1>Flashbots bundles</h1>
      <div class="form">
        <MetaInput
          v-model="blockNumber"
          :label="'Block number'"
        />
        <div>
          <MetaButton
            :label="'Inspect'"
            @click="fetchBlock"
          />
        </div>
      </div>
      <div
        v-if="isLoading"
        class="loading"
      >
        <LoadingIndicator />
      </div>
      <div v-else-if="block">
        <MetaCard>
          <div>Block #{{ block.number }}</div>
          <div>Reward: {{ formatEther(block.reward) }} ETH</div>
          <div>Miner: {{ formatAddress(block.miner) }}</div>
          <div class="bundles">
            <div
              v-for="(bundle, index) in block.bundles"
              :key="index"
              class="bundle"
            >
              <h2>{{ bundle.type }} Bundle</h2>
              <div class="transactions">
                <div
                  v-for="transaction in bundle.transactions"
                  :key="transaction.hash"
                  class="transaction"
                >
                  <h3>Transaction</h3>
                  <div>Hash: {{ formatHash(transaction.hash) }}</div>
                  <div>From: {{ transaction.from }}</div>
                  <div>To: {{ transaction.to }}</div>
                  <details>
                    <summary>Logs</summary>
                    <div class="logs">
                      <div
                        v-for="log in receipts[transaction.hash].logs"
                        :key="log.logIndex"
                        class="log"
                      >
                        <h3>Log</h3>
                        <div>Index: {{ log.logIndex }}</div>
                        <div>
                          Topics
                          <ul>
                            <li
                              v-for="(topic, topicIndex) in log.topics"
                              :key="topicIndex"
                            >
                              {{ topic }}
                            </li>
                          </ul>
                        </div>
                        <div class="log-data">Data: {{ log.data }}</div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </MetaCard>
      </div>
      <div
        v-else
        class="latest"
      >
        <MetaCard class="latest-card">
          <h2>Latest Flashbots blocks</h2>
          <div class="block-cards">
            <div
              v-for="blockEl in blocks"
              :key="blockEl.number"
              class="block-card"
            >
              <div class="block-card-number">Block #{{ blockEl.number }}</div>
              <div class="block-card-miner">
                Mined by {{ formatAddress(blockEl.miner) }}
              </div>
              <div class="block-card-reward">
                Reward: {{ formatEther(blockEl.reward) }} ETH
              </div>
            </div>
          </div>
        </MetaCard>

        <MetaCard class="latest-card">
          <h2>Latest bundles</h2>
          <div class="block-cards">
            <div
              v-for="(bundle, index) in bundles"
              :key="index"
              class="bundle-card"
            >
              <div class="bundle-card-type">Type: {{ bundle.type }}</div>
              <div class="bundle-card-transactions">
                {{ bundle.transactions.length }} transactions
              </div>
            </div>
          </div>
        </MetaCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlchemyProvider, TransactionReceipt } from '@ethersproject/providers';
import { formatEther as formatEth } from '@ethersproject/units';
import { computed, onMounted, ref } from 'vue';

import LoadingIndicator from '@/components/LoadingIndicator.vue';
import MetaButton from '@/components/MetaButton.vue';
import MetaCard from '@/components/MetaCard.vue';
import MetaInput from '@/components/MetaInput.vue';
import EthereumService from '@/services/ethereum';
import FlashbotsService, { Block } from '@/services/flashbots';

onMounted(() => {
  fetchBlocks();
});

const provider = new AlchemyProvider(1, 'NEwRam_rhHUN2SJWDeHcU5Luij4Tcuxq');
const service = new FlashbotsService();
const ethereumService = new EthereumService(provider);

const isLoading = ref(true);
const blocks = ref<Block[]>([]);
const bundles = computed(() =>
  blocks.value
    .map((block) => block.bundles)
    .flat()
    .slice(0, 6),
);

async function fetchBlocks(): Promise<void> {
  blocks.value = await service.getLatestBlocks(5);
  blocks.value.reverse();
  isLoading.value = false;
}

const blockNumber = ref('');
const block = ref<Block | null>(null);
const receipts = ref<Record<string, TransactionReceipt>>({});

async function fetchBlock(): Promise<void> {
  isLoading.value = true;
  const blockNumberValue = parseInt(blockNumber.value);
  block.value = await service.getBlock(blockNumberValue);
  const hashes = block.value.bundles
    .map((bundle) => bundle.transactions)
    .flat()
    .map((tx) => tx.hash);
  receipts.value = {};
  for (const hash of hashes) {
    const receipt = await ethereumService.getReceipt(hash);
    receipts.value[hash] = receipt;
  }
  isLoading.value = false;
}

function formatAddress(address: string): string {
  return `${address.substring(0, 6)}…${address.substring(38)}`;
}

function formatHash(hash: string): string {
  return `${hash.substring(0, 18)}…${hash.substring(50)}`;
}

function formatEther(amount: bigint): string {
  return formatEth(amount.toString()).substring(0, 8);
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

h2 {
  margin: 0;
  font-size: 16px;
}

h3 {
  margin: 0;
  font-size: 14px;
}

.form {
  display: flex;
  grid-gap: 16px;
  flex-direction: column;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.latest {
  display: flex;
  gap: 16px;
}

.latest-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: calc(50% - 8px);
}

.block-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.block-card,
.bundle-card {
  padding: 4px;
  border: 1px solid #a6a6a6;
}

.block-card-number,
.bundle-card-type {
  font-size: 12px;
}

.block-card-miner,
.block-card-reward,
.bundle-card-transactions {
  font-size: 14px;
}

.bundles,
.transactions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bundle {
  padding: 8px;
  background: #ddd;
}

.transaction {
  padding: 8px;
  background: #ccc;
}

.logs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log {
  padding: 8px;
  font-size: 12px;
}

.log-data {
  overflow-wrap: break-word;
}
</style>
