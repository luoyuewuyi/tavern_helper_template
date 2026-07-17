<template>
  <main class="opening-shell" :data-ui-version="UI_VERSION">
    <OpeningForm
      :busy="busy"
      :completed-message-id="completedMessageId"
      :error="error"
      @submit="handleSubmit"
    />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { startGame } from './actions/start-game';
import OpeningForm from './components/OpeningForm.vue';
import type { OpeningInput } from './opening-contract';
import { UI_VERSION } from './release';

const busy = ref(false);
const error = ref('');
const completedMessageId = ref<number | null>(null);

async function handleSubmit(input: OpeningInput) {
  busy.value = true;
  error.value = '';
  try {
    const created = await startGame(input);
    completedMessageId.value = created.messageId;
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : String(cause);
  } finally {
    busy.value = false;
  }
}
</script>

<style scoped>
.opening-shell {
  display: grid;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
}
</style>
