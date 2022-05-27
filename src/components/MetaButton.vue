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
}
</style>
