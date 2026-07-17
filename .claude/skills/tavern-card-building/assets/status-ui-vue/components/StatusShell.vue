<template>
  <main class="status-shell" :data-ui-version="UI_VERSION">
    <slot />
  </main>
</template>

<script setup lang="ts">
import { UI_VERSION } from '../release';
</script>

<style scoped>
.status-shell {
  width: min(100%, 48rem);
  margin-inline: auto;
  padding: 0.75rem;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 0.75rem;
  background: rgb(20 22 28 / 92%);
  color: #f5f7fb;
}
</style>
