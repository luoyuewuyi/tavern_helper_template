<template>
  <div class="world-section">
    <div class="meta-row">
      <span class="meta-item">
        <span class="meta-label">时辰</span>
        <span class="meta-value">{{ store.data.世界.当前时间 || '未知' }}</span>
      </span>
      <span class="meta-item">
        <span class="meta-label">所在</span>
        <span class="meta-value">{{ store.data.世界.当前地点 || '未知' }}</span>
      </span>
    </div>
    <div class="event-area">
      <div class="event-badge">
        <span class="event-icon">◈</span>
        <span class="event-text">{{ store.data.世界.当前事件 || '风平浪静' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.world-section {
  border-bottom: 2px solid var(--c-gold);
  padding: 10px 12px;
  background: linear-gradient(135deg, var(--c-parchment), var(--c-bamboo));
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px dashed var(--c-gold);
  flex-wrap: wrap;
  gap: 6px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.meta-label {
  font-size: 0.75rem;
  color: var(--c-umber);
  padding: 1px 5px;
  border: 1px solid var(--c-gold);
  background: rgba(201, 168, 92, 0.1);
}

.meta-value {
  font-weight: bold;
  font-size: 0.88rem;
}

.event-area {
  display: flex;
  gap: 8px;
}

.event-badge {
  background: var(--c-cloud);
  border: 1px solid var(--c-gold);
  padding: 6px 10px;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
}

.event-badge::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--c-jade);
}

.event-icon {
  color: var(--c-jade);
  font-size: 0.9rem;
}

.event-text {
  font-size: 0.82rem;
  line-height: 1.4;
}

@media (max-width: 600px) {
  .meta-row {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
