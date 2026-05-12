<template>
  <div class="world-header">
    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-label">时间</span>
        <span class="meta-value">{{ store.data.世界.当前时间 }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">地点</span>
        <span class="meta-value">{{ store.data.世界.当前地点 }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">阶段</span>
        <span class="meta-value phase-tag">{{ store.data.世界.审问阶段 }}</span>
      </div>
    </div>
    <div class="atmosphere-bar">
      <span class="atmo-icon">◈</span>
      <span class="atmo-text">{{ store.data.世界.场景氛围 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.world-header {
  padding: 8px 12px;
  border-bottom: 1px solid var(--c-border);
  background: var(--c-bg-dark);
}

.meta-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  margin-bottom: 6px;
}

.meta-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.meta-label {
  font-size: 10px;
  color: var(--c-text-dim);
  letter-spacing: 1px;
  text-transform: uppercase;
  flex-shrink: 0;
}

.meta-value {
  font-size: 12px;
  color: var(--c-text-bright);
  font-weight: bold;
}

.phase-tag {
  background: var(--c-accent-red);
  color: var(--c-text-bright);
  padding: 0 6px;
  font-size: 11px;
  letter-spacing: 1px;
}

.atmosphere-bar {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 5px 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--c-border-light);
  font-size: 11px;
  color: var(--c-text-dim);
  font-style: italic;
  line-height: 1.4;
}

.atmo-icon {
  color: var(--c-accent-amber);
  flex-shrink: 0;
  margin-top: 1px;
}

@media (max-width: 500px) {
  .meta-grid {
    flex-direction: column;
    gap: 3px;
  }
}
</style>
