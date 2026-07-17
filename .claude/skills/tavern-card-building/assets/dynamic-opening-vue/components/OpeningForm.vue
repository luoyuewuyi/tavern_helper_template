<template>
  <form class="opening-form" @submit.prevent="submit">
    <label>
      <span>时代</span>
      <input v-model.trim="era" name="era" required autocomplete="off" />
    </label>
    <label>
      <span>地区</span>
      <input v-model.trim="region" name="region" required autocomplete="off" />
    </label>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="completedMessageId !== null" role="status">
      已创建并回读第 {{ completedMessageId }} 层开场消息。
    </p>
    <button type="submit" :disabled="busy || completedMessageId !== null">
      {{ busy ? '正在创建并回读…' : completedMessageId !== null ? '开局已完成' : '开始游戏' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { OpeningInput } from '../opening-contract';

defineProps<{ busy: boolean; completedMessageId: number | null; error: string }>();
const emit = defineEmits<{ submit: [input: OpeningInput] }>();

const era = ref('');
const region = ref('');

function submit() {
  emit('submit', { era: era.value, region: region.value });
}
</script>

<style scoped>
.opening-form {
  display: grid;
  gap: 0.75rem;
}

label {
  display: grid;
  gap: 0.35rem;
}

input,
button {
  min-height: 2.75rem;
  font: inherit;
}

[role='alert'] {
  margin: 0;
  color: #c0392b;
  overflow-wrap: anywhere;
}

[role='status'] {
  margin: 0;
  color: #2e7d32;
  overflow-wrap: anywhere;
}
</style>
