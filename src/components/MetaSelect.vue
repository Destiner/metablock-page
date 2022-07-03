<template>
  <div class="select">
    <Select
      :model-value="modelValue"
      :label="label"
      :options="options"
      @update:model-value="handleUpdate"
    >
      <template #trigger="{ selectedItem }">
        <div class="trigger">
          {{ selectedItem.label }}
          <IconArrowDown class="icon" />
        </div>
      </template>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { Select } from 'brickwork-vue';

import IconArrowDown from '@/components/icons/ArrowDown.vue';

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

function handleUpdate(value: string): void {
  emit('update:modelValue', value);
}
</script>

<style scoped>
.select {
  --color-label: black;
  --font-size-label: 12px;
  --padding-button: 8px;
  --color-button: black;
  --border-radius-button: 0;
  --font-size-button: 14px;
  --background-button: #eee;
  --background-button-hover: #eee;
  --box-shadow-button: none;
  --box-shadow-button-hover: none;
  --padding-list: 0;
  --border-radius-list: 0;
  --box-shadow-list: none;
  --padding-item: 4px 16px;
  --color-item: black;
  --border-radius-item: 0;
  --background-item-active: #eee;
  --color-item-active: black;
}

.trigger {
  display: flex;
  gap: 128px;
}

.icon {
  width: 12px;
  height: 12px;
}
</style>
