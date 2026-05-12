<template>
  <div class="world-section">
    <div class="realm-indicator">
      <span class="realm-icon">◈</span>
      <span class="realm-name">忒弥斯双生界</span>
    </div>
    <div class="meta-row">
      <div class="meta-item">
        <span class="meta-label">日期</span>
        <span class="meta-value">{{ store.data.世界.当前日期 }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">时间</span>
        <span class="meta-value">{{ store.data.世界.当前时间 }}</span>
      </div>
    </div>
    <div class="location-row">
      <span class="location-icon">📍</span>
      <span class="location-text">{{ store.data.世界.当前地点 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.world-section {
  padding: 12px;
  background: linear-gradient(180deg, rgba(45, 45, 61, 0.8) 0%, transparent 100%);
  border-bottom: 1px solid var(--c-shadow);
}

.realm-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.realm-icon {
  color: var(--c-gold);
  font-size: 1.2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.realm-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--c-ghost);
  letter-spacing: 2px;
}

.meta-row {
  display: flex;
  gap: 20px;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 0.7rem;
  color: var(--c-pale);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.meta-value {
  font-size: 0.9rem;
  color: var(--c-ghost);
  font-weight: 500;
}

.location-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  border-left: 3px solid var(--c-corrupt);
}

.location-icon {
  font-size: 0.9rem;
}

.location-text {
  font-size: 0.85rem;
  color: var(--c-pale);
}
</style>
