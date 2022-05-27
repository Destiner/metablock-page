<template>
  <Select
    class="select"
    :model-value="modelValue"
    :label="label"
    :options="options"
    @update:model-value="handleUpdate"
  >
    <template #trigger="{ selectedItem }"> {{ selectedItem.label }} </template>
  </Select>
</template>

<script
  setup
  lang="ts"
>
import { Select } from 'brickwork-vue';

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
}
</style>
