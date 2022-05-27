<template>
  <Input
    class="input"
    :model-value="modelValue"
    :placeholder="placeholder"
    @update:model-value="handleUpdate"
  >
  </Input>
</template>

<script
  setup
  lang="ts"
>
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
}
</style>
