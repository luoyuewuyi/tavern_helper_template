<template>
  <div class="world-section">
    <div class="world-row">
      <span class="world-item">📍 {{ store.data.天下.当前地点 }}</span>
    </div>
    <div class="world-row">
      <span class="world-item">🕐 {{ store.data.天下.当前时间 }}</span>
    </div>
    <div class="event-row">
      <span class="event-label">⚡</span>
      <span class="event-text">{{ store.data.天下.当前事件 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
const store = useDataStore();
</script>

<style lang="scss" scoped>
.world-section {
  padding: 10px 14px;
  border-bottom: 1px solid var(--jl-gold-light);
  background: linear-gradient(135deg, var(--jl-paper) 0%, var(--jl-paper-dark) 100%);
}

.world-row {
  margin-bottom: 4px;
}

.world-item {
  font-size: 0.85rem;
  color: var(--jl-ink-light);
}

.event-row {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-top: 6px;
  padding: 6px 8px;
  background: rgba(196, 70, 58, 0.06);
  border-left: 3px solid var(--jl-vermillion);
  border-radius: 0 4px 4px 0;
}

.event-label {
  flex-shrink: 0;
}

.event-text {
  font-size: 0.85rem;
  color: var(--jl-ink);
  font-weight: 500;
}
</style>
