<template>
  <Button class="button">
    {{ label }}
  </Button>
</template>

<script setup lang="ts">
import { Button } from 'brickwork-vue';

defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.button {
  --font-weight: 400;
  --color: black;
  --color-disabled: #444;
  --background: #eee;
  --background-hover: #d9d9d9;
  --background-disabled: #ccc;
  --border-radius: 0;
  --box-shadow: none;
  --box-shadow-hover: none;
}
</style>
