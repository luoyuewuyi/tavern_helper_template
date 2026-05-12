<template>
  <div class="world-section">
    <div class="header-row">
      <span class="label">⏰</span>
      <span class="value">{{ store.data.世界.当前时间 }}</span>
    </div>
    <div class="header-row">
      <span class="label">📍</span>
      <span class="value location">{{ store.data.世界.当前大陆 }} · {{ store.data.世界.当前地点 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.world-section {
  padding: 14px 16px;
  background: linear-gradient(135deg, var(--c-bg-deep) 0%, var(--c-bg-panel) 100%);
  border-bottom: 1px solid var(--c-border);
}

.header-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  font-size: 14px;
  flex-shrink: 0;
}

.value {
  font-size: 12px;
  color: var(--c-text-dim);
}

.location {
  color: var(--c-accent);
  font-weight: 600;
}
</style>
