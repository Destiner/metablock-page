<template>
  <Input
    class="input"
    :model-value="modelValue"
    :placeholder="placeholder"
    @update:model-value="handleUpdate"
  >
  </Input>
</template>

<script setup lang="ts">
import { Input } from 'brickwork-vue';

defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
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
.input {
  --color-label: black;
  --color-input: black;
  --padding-input: 8px;
  --font-size-input: 14px;
  --background-input: #eee;
  --background-input-focus: #d9d9d9;
  --border-input: 1px solid #b5b5b5;
  --border-input-focus: 1px solid #b5b5b5;
  --border-radius-input: 0;

  width: 100%;
}
</style>
