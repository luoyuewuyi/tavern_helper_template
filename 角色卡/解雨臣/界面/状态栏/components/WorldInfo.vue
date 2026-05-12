<template>
  <div class="world-section">
    <div class="meta-row">
      <span>🕐 {{ store.data.世界.当前时间 }}</span>
      <span>📍 {{ store.data.世界.当前地点 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.world-section {
  padding: 8px 12px;
  border-bottom: 1px solid rgba(160, 144, 112, 0.25);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.88em;
  color: var(--c-grey-ink);
  flex-wrap: wrap;
  gap: 6px;
}
</style>
